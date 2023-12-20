export function updateButtonsPosition(
  element: HTMLElement | null,
  buttonContainer: HTMLElement | null
) {
  if (!element || !buttonContainer) {
    return;
  }
  const rect = element.getBoundingClientRect();

  // Calculate the position for the buttonContainer
  const buttonContainerTop =
    rect.top + window.scrollY - buttonContainer.offsetHeight - 10;
  const buttonContainerLeft =
    rect.left + window.scrollX + rect.width - buttonContainer.offsetWidth - 10;
  console.log({ buttonContainerTop, buttonContainerLeft });

  // Apply calculated positions
  buttonContainer.style.top = `${buttonContainerTop}px`;
  buttonContainer.style.left = `${buttonContainerLeft}px`;

  // Append the buttonContainer to the body only if it's not already there
  if (buttonContainer.parentNode !== document.body) {
    document.body.appendChild(buttonContainer);
  }
}
