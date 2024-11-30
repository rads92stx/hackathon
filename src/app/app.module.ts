import { ApiModule } from '@api/api.module';
import { AppController } from '@app/app.controller';
import { AppConfigModule } from '@config/app-config.module';
import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OpenaiModule } from 'src/openai/openai.module';
import { QDrantModule } from 'src/qdrant/qdrant.module';

@Module({
  imports: [ConfigModule.forRoot(), AppConfigModule.forRoot(), QDrantModule.forRoot(), OpenaiModule.forRoot(), ApiModule],
  controllers: [AppController]
})
export class AppModule implements OnApplicationBootstrap {
  async onApplicationBootstrap() {
    // const oauth2Client = new google.auth.JWT({
    //   key: 'AIzaSyBrtxckfUII-v6UqJXN_Si4MEaFYsM_ERs'
    // });
    // console.log(oauth2Client.apiKey);
    // oauth2Client.authorize();
    // const keyFile = path.join(process.env.HACKHATON_APP_ROOT, 'gcloud.json');
    // const keyJSON = JSON.parse(fs.readFileSync(keyFile).toString());
    // const auth = new google.auth.JWT(
    //   'stx-hackhaton@stx-hackhaton-443313.iam.gserviceaccount.com',
    //   keyFile,
    //   null,
    //   ['https://mail.google.com/'],
    //   ''
    // );
    // const auth = new GoogleAuth({
    //   keyFile,
    //   scopes: ['https://www.googleapis.com/auth/gmail.labels'],
    //   clientOptions: {
    //     subject: 'stx-hackhaton@stx-hackhaton-443313.iam.gserviceaccount.com'
    //   }
    // });
    // await auth.authorize();
    // google.options({ auth });
    // const qwe = await auth.authorize();
    // console.log(qwe);
    // const client = await auth.getClient();
    // client.setCredentials(keyJSON);
    // const gmail = google.gmail({
    //   version: 'v1',
    //   auth
    // });
    // console.log(
    //   await gmail.users.labels.list({
    //     userId: 'me'
    //   })
    // );
    // gmail.users.watch({
    //   userId: 'me',
    //   requestBody: {
    //     topicName: 'projects/your-project/topics/your-topic',
    //     labelIds: ['INBOX']
    //   }
    // });
  }
}
