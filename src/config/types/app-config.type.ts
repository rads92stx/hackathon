export interface IAppConfig {
  QDRANT_URL: string;
  QDRANT_API_KEY: string;
  OPENAI_API_KEY: string;
  GCLOUD_CLIENT_ID: string;
  GCLOUD_CLIENT_SECRET: string;
  GCLOUD_REDIRECT_URL: string;
  GCLOUD_SCOPES: string;
  CRON_EMAIL_CHECK: string;
  LOGS_DIR: string;
  LOGS_MAX_FILES: string;
}
