export const getCurrentPath = () => {
  return window.location.pathname;
};

export const navigateTo = (to: string) => {
  window.history.pushState({}, '', to);

  const navigationEvent = new PopStateEvent('popstate');
  window.dispatchEvent(navigationEvent);
};