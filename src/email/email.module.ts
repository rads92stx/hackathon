import { AppConfigService } from '@config/services/app-config.service';
import { GoogleService } from '@google/services/google.service';
import { DynamicModule, Inject, Module, OnApplicationBootstrap } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Module({})
export class EmailModule implements OnApplicationBootstrap {
  @Inject(GoogleService)
  private __googleService: GoogleService;
  @Inject(AppConfigService)
  private __configService: AppConfigService;
  @Inject(SchedulerRegistry)
  private __scheduleRegistry: SchedulerRegistry;

  static forRoot(): DynamicModule {
    return {
      module: EmailModule,
      global: true
    };
  }

  async onApplicationBootstrap(): Promise<void> {
    this.__googleService.token$.subscribe(() => this.__handleCronJob());
  }

  private __handleCronJob(): void {
    const cronJobName = 'gmail-check';
    const cronJobTime = this.__configService.get('CRON_EMAIL_CHECK');
    const cronJobExists = this.__scheduleRegistry.doesExist('cron', cronJobName);

    if (cronJobExists) {
      this.__scheduleRegistry.getCronJob(cronJobName).stop();
      this.__scheduleRegistry.deleteCronJob(cronJobName);
    }

    const newCronJob = new CronJob(cronJobTime, () => this.__processEmails());

    this.__scheduleRegistry.addCronJob(cronJobName, newCronJob);
    newCronJob.start();

    this.__processEmails();
  }

  private async __processEmails(): Promise<void> {
    const emails = await this.__googleService.getUnreadEmails();
    console.log('Unread emails:', emails);
    // TODO: Process emails with Skynet probably in some external service, from this module or other.
  }
}
