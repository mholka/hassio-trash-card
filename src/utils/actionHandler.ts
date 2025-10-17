import { fireEvent } from './fireEvent';

type ActionConfig = {
  action?: string;
  navigation_path?: string;
  url?: string;
};

const handleAction = (
  node: HTMLElement,
  hass: any,
  actionConfig?: ActionConfig,
  entity?: string
) => {
  if (!actionConfig || actionConfig.action === 'none') {
    return;
  }

  const action = actionConfig.action ?? 'more-info';

  switch (action) {
    case 'more-info':
      // Open the more-info dialog for the entity if provided
      if (entity) {
        fireEvent(node, 'hass-more-info', { entityId: entity });
      }
      break;
    case 'navigate':
      if (actionConfig.navigation_path) {
        // Use hass to navigate if available, otherwise change location
        try {
          // eslint-disable-next-line no-underscore-dangle,@typescript-eslint/no-explicit-any
          (hass as any).router?.navigate(actionConfig.navigation_path);
        } catch {
          window.location.href = actionConfig.navigation_path;
        }
      }
      break;
    case 'url':
      if (actionConfig.url) {
        window.open(actionConfig.url, '_blank');
      }
      break;
    default:
      // unknown actions can dispatch a generic event
      fireEvent(node, 'action', { action, config: actionConfig, entity });
  }
};

export {
  handleAction
};
