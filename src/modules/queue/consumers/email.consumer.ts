import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { EmailService } from "../../mail";

@Processor("email")
export class EmailConsumer extends WorkerHost {

  constructor(private readonly emailService: EmailService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.emailService.sendMail(job.data);
  }

  @OnWorkerEvent("active")
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`
    );
  }

  @OnWorkerEvent("failed")
  onFailed(job: Job) {
    console.log(
      `Failed job ${job.id} of type ${job.name} with data ${job.data}...`
    );
  }
}
