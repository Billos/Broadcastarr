type PromiseListener = () => Promise<void>

type ListenerWithPriority = {
  listener: PromiseListener;
  priority: number;
}

const listeners: ListenerWithPriority[] = []

const processExit = async () => {
  for (const { listener } of listeners) {
    await listener()
  }
  process.exit(0)
}

function onExit(listener: PromiseListener, priority = 0): void {
  // Add the listener with its priority
  listeners.push({ listener, priority })

  // Sort listeners by priority so the highest runs last
  listeners.sort((listener1, listener2) => listener1.priority - listener2.priority)
}
process.on("SIGTERM", processExit)
process.on("SIGINT", processExit)

export default onExit
