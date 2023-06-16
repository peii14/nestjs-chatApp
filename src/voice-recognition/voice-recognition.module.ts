import { Injectable, OnModuleInit } from '@nestjs/common';
import { PubSub } from '@google-cloud/pubsub';

@Injectable()
export class PubSubService implements OnModuleInit {
  private pubSubClient: PubSub;

  constructor() {
    this.pubSubClient = new PubSub();
  }

  onModuleInit() {
    this.listenForMessages('prediction_result', 60);
  }

  async publishMessage(
    topicName: string,
    data: Record<string, unknown>,
  ): Promise<string> {
    const dataBuffer = Buffer.from(JSON.stringify(data));

    const messageId = await this.pubSubClient
      .topic(topicName)
      .publish(dataBuffer);

    return messageId;
  }

  listenForMessages(subscriptionName: string, timeout: number): void {
    const subscription = this.pubSubClient.subscription(subscriptionName);

    let messageCount = 0;
    const messageHandler = (message) => {
      console.log(`Received message ${message.id}:`);
      console.log(`\tData: ${message.data}`);
      console.log(`\tAttributes: ${message.attributes}`);
      messageCount += 1;

      // "Ack" (acknowledge receipt of) the message
      message.ack();
    };

    // Listen for new messages until timeout is hit
    subscription.on('message', messageHandler);

    setTimeout(() => {
      subscription.removeListener('message', messageHandler);
      console.log(`${messageCount} message(s) received.`);
    }, timeout * 1000);
  }
}
