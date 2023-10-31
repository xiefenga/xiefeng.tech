interface ViewTransition {
  ready: Promise<void>
  finished: Promise<void>
}

interface SupportTransition {
  startViewTransition: (callback: () => void) => ViewTransition
}
