/* eslint-disable @typescript-eslint/naming-convention */
import { noChange } from 'lit';
import { directive, Directive } from 'lit/directive.js';

import type { AttributePart, DirectiveParameters } from 'lit/directive.js';

interface ActionHandlerOptions {
  hasHold?: boolean;
  hasDoubleClick?: boolean;
  disabled?: boolean;
}

interface ActionHandlerDetail {
  action: 'hold' | 'tap' | 'double_tap';
}

type ActionHandlerEvent = CustomEvent<ActionHandlerDetail>;

interface ActionHandlerElement extends HTMLElement {
  bind: (element: Element, options?: ActionHandlerOptions) => void;
}

declare global {
  interface HASSDomEvents {
    action: ActionHandlerDetail;
  }
}

/**
 * Reuses the `action-handler` element provided by the Home Assistant frontend,
 * which takes care of tap, hold and double tap detection (including ripple and
 * haptic feedback).
 */
const getActionHandler = (): ActionHandlerElement | undefined => {
  const { body } = document;
  const existing = body.querySelector<ActionHandlerElement>('action-handler');

  if (existing) {
    return existing;
  }

  if (!customElements.get('action-handler')) {
    return undefined;
  }

  const actionHandlerElement = document.createElement('action-handler') as ActionHandlerElement;

  body.append(actionHandlerElement);

  return actionHandlerElement;
};

const actionHandlerBind = (element: Element, options?: ActionHandlerOptions) => {
  const actionHandlerElement = getActionHandler();

  if (!actionHandlerElement) {
    return;
  }

  actionHandlerElement.bind(element, options);
};

const actionHandler = directive(
  class extends Directive {
    // eslint-disable-next-line class-methods-use-this
    public update (part: AttributePart, [ options ]: DirectiveParameters<this>) {
      actionHandlerBind(part.element, options);

      return noChange;
    }

    // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function, no-underscore-dangle
    public render (_options?: ActionHandlerOptions) {}
  }
);

export {
  actionHandler,
  actionHandlerBind
};

export type {
  ActionHandlerOptions,
  ActionHandlerDetail,
  ActionHandlerEvent
};
