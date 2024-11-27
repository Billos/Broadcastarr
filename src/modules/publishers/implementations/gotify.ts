import { Application, GotifyAPI } from "../../../api/gotify"
import mainLogger from "../../../utils/logger"
import { CategoryDocument } from "../../category"
import MarkdownPublisher from "../markdown"

class GotifyPublisher extends MarkdownPublisher {
  public name = "Gotify"

  public constructor() {
    super()
  }

  public async init(): Promise<void> {
    // Nothing to do here
  }

  public async start(): Promise<void> {
    // Nothing to do here
  }

  private generateApplicationName(category: CategoryDocument): string {
    return `Broadcastarr - ${category.name}`
  }

  private async getOrCreateApplication(category: CategoryDocument): Promise<Application> {
    const applications = await GotifyAPI.getApplications()
    const application = applications.find(({ name }) => name === this.generateApplicationName(category))
    if (application) {
      return application
    }
    return GotifyAPI.createApplication({ name: this.generateApplicationName(category) })
  }

  public async clear(category: CategoryDocument): Promise<void> {
    const logger = mainLogger.getSubLogger({ name: "GotifyPublisher", prefix: ["clear", `category ${category.name}`] })
    const applications = await GotifyAPI.getApplications()
    const allApplicationsOfCategory = applications.filter(({ name }) => name === this.generateApplicationName(category))
    for (const application of allApplicationsOfCategory) {
      logger.info(`Deleting application ${application.name}`)
      await GotifyAPI.deleteApplication(application.id)
    }

    // Recreate application
    logger.info("Recreating application")
    const app = await GotifyAPI.createApplication({ name: this.generateApplicationName(category) })
    logger.info(`Application created with id ${app.id}`)
  }

  public override async listMessages(category: CategoryDocument): Promise<string[]> {
    const logger = mainLogger.getSubLogger({ name: "GotifyPublisher", prefix: ["listMessages", `category ${category.name}`] })
    const application = await this.getOrCreateApplication(category)
    logger.info(`Getting messages for application ${application.id}`)
    const messages = await GotifyAPI.getMessagesOfApplication(application.id)
    return messages.map(({ id }) => `${id}`)
  }

  protected override async sendMessage(category: CategoryDocument, message: string): Promise<string[]> {
    const logger = mainLogger.getSubLogger({ name: "GotifyPublisher", prefix: ["sendMessages", `category ${category.name}`] })
    const application = await this.getOrCreateApplication(category)
    logger.info(`Sending message to application ${application.name}`)
    const extras = {
      "client::display": {
        contentType: "text/markdown",
      },
    }
    const msg = await GotifyAPI.createMessage(application, { message, extras })
    return [`${msg.id}`]
  }

  protected async removeMessages(category: string, ids: string[]): Promise<void> {
    const logger = mainLogger.getSubLogger({ name: "GotifyPublisher", prefix: ["removeMessages", `category ${category}`] })
    logger.info(`Removing messages from category ${category}`)
    for (const id of ids) {
      await GotifyAPI.deleteMessage(id)
    }
  }

  public async updateChannelName(category: CategoryDocument): Promise<void> {
    const logger = mainLogger.getSubLogger({ name: "GotifyPublisher", prefix: ["updateChannelName", `category ${category.name}`] })
    logger.trace("Nothing to do here")
  }
}

export default GotifyPublisher
