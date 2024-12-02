import { AppConfigService } from '@config/services/app-config.service';
import { ConsoleLogger, Injectable } from '@nestjs/common';
import { format, loggers, transports, Logger as WinstonLogger } from 'winston';
import 'winston-daily-rotate-file';

import { ConsoleTransportInstance, DailyRotateFile } from 'winston/lib/winston/transports';
const { printf, timestamp } = format;

const env = process.env.NODE_ENV || 'development';
const AppLoggerColorizer = format.colorize();

interface IAppLoggerConfig {
  dir: string;
  maxFiles: string;
}

const AppLoggerFormat = printf((info: any): string => {
  let message = `[${info.level}] [${info.context}]${info.message}`;
  env !== 'development' && (message = `[${info.timestamp}] ${message}`);
  return AppLoggerColorizer.colorize(info.level, message);
});

const AppLoggerCreateConsoleTransport = (): ConsoleTransportInstance => {
  return new transports.Console({
    format: format.combine(
      format.align(),
      timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      AppLoggerFormat
    )
  });
};

const AppLoggerCreateFileTransport = (filename: string, config: IAppLoggerConfig): any => {
  return new DailyRotateFile({
    filename: `${filename}-%DATE%.log`,
    dirname: config.dir,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: config.maxFiles,
    format: format.combine(
      timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      format.json()
    )
  });
};

@Injectable()
export class AppLoggerService extends ConsoleLogger {
  private readonly __loggerApp: WinstonLogger;
  private readonly __loggerError: WinstonLogger;

  constructor(private readonly __configService: AppConfigService) {
    super();

    loggers.add('app', {
      levels: {
        warn: 1,
        info: 2,
        http: 3,
        verbose: 4,
        debug: 5,
        silly: 6
      },
      transports: [AppLoggerCreateConsoleTransport(), AppLoggerCreateFileTransport('app', this.config)]
    });

    loggers.add('error', {
      handleExceptions: true,
      level: 'error',
      transports: [AppLoggerCreateConsoleTransport(), AppLoggerCreateFileTransport('error', this.config)],
      exceptionHandlers: [AppLoggerCreateConsoleTransport(), AppLoggerCreateFileTransport('exception', this.config)]
    });

    this.__loggerApp = loggers.get('app');
    this.__loggerError = loggers.get('error');

    this.__loggerApp.on('error', (err: unknown): void => console.error(err));
    this.__loggerError.on('error', (err: unknown): void => console.error(err));
  }

  get config(): IAppLoggerConfig {
    return {
      dir: this.__configService.get('LOGS_DIR'),
      maxFiles: this.__configService.get('LOGS_MAX_FILES')
    };
  }

  error(message: string, trace?: string, context?: string): void {
    this.__loggerError.error({
      message,
      context,
      trace
    });
  }

  warn(message: string, context?: string): void {
    this.__loggerApp.warn({
      message,
      context
    });
  }

  log(message: string, context?: string): void {
    this.__loggerApp.info({
      message,
      context
    });
  }

  debug(message: string, context?: string): void {
    this.__loggerApp.debug({
      message,
      context
    });
  }

  verbose(message: string, context?: string): void {
    this.__loggerApp.verbose({
      message,
      context
    });
  }
}
