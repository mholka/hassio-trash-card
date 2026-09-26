/* eslint-disable @typescript-eslint/naming-convention */
import { fireEvent } from './fireEvent';

interface ActionConfig {
  action: string;
  [key: string]: unknown;
}

interface ActionsConfig {
  entity?: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}

type ActionType = 'tap' | 'hold' | 'double_tap';

declare global {
  interface HASSDomEvents {
    'hass-action': {
      config: ActionsConfig;
      action: ActionType;
    };
  }
}

const hasAction = (config?: ActionConfig): boolean =>
  config !== undefined && config.action !== 'none';

/**
 * Delegates the action to the Home Assistant frontend, which supports all
 * standard actions (more-info, toggle, navigate, url, perform-action,
 * assist, fire-dom-event, confirmation, ...).
 */
const handleAction = (node: HTMLElement, config: ActionsConfig, action: ActionType) => {
  fireEvent(node, 'hass-action', { config, action });
};

export {
  handleAction,
  hasAction
};

export type {
  ActionConfig,
  ActionsConfig,
  ActionType
};
