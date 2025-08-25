import { useCallback } from "react"

export const useScrollToMessage = () => {
  const scrollToMessage = useCallback((messageId: string) => {
    const messageElement = document.querySelector(`[data-message-id="${messageId}"]`)

    if (messageElement) {
      // Smooth scroll to the message
      messageElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })

      // Add a highlight effect
      messageElement.classList.add("highlight-message")

      // Remove highlight after animation
      setTimeout(() => {
        messageElement.classList.remove("highlight-message")
      }, 2000)
    }
  }, [])

  return scrollToMessage
}
