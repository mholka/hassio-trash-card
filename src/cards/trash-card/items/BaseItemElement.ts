/* eslint-disable unicorn/filename-case */
import { LitElement, html } from 'lit';
import { state } from 'lit/decorators.js';
import { getPicture } from '../../../utils/getPicture';
import { handleAction, hasAction } from '../../../utils/handleAction';

import type { TrashCardConfig } from '../trash-card-config';
import type { CalendarItem } from '../../../utils/calendarItem';
import type { HomeAssistant } from '../../../utils/ha';
import type { ActionHandlerEvent, ActionHandlerOptions } from '../../../utils/actionHandler';
import type { ActionsConfig } from '../../../utils/handleAction';

// eslint-disable-next-line @typescript-eslint/ban-types
class BaseItemElement<T = {}> extends LitElement {
  @state() protected readonly item?: CalendarItem & T;

  @state() protected readonly hass?: HomeAssistant;

  @state() protected readonly config?: TrashCardConfig;

  protected withBackground = false;

  /**
   * Action config for the current item. `entity` points to the calendar the
   * event originates from, so `more-info` and `toggle` target that calendar.
   */
  protected getActionsConfig (): ActionsConfig {
    return {
      entity: this.item?.content.entity,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      tap_action: this.config?.tap_action,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      hold_action: this.config?.hold_action,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      double_tap_action: this.config?.double_tap_action
    };
  }

  protected hasAnyAction (): boolean {
    const { tap_action, hold_action, double_tap_action } = this.getActionsConfig();

    return hasAction(tap_action) || hasAction(hold_action) || hasAction(double_tap_action);
  }

  protected getActionHandlerOptions (): ActionHandlerOptions {
    const { hold_action, double_tap_action } = this.getActionsConfig();

    return {
      hasHold: hasAction(hold_action),
      hasDoubleClick: hasAction(double_tap_action),
      disabled: !this.hasAnyAction()
    };
  }

  protected readonly onAction = (ev: ActionHandlerEvent) => {
    ev.stopPropagation();
    handleAction(this, this.getActionsConfig(), ev.detail.action);
  };

  protected getPictureUrl () {
    return getPicture(this.item!.picture, this.hass!);
  }

  // eslint-disable-next-line class-methods-use-this
  protected renderPicture (pictureUrl: string) {
    return html`
    <hui-image
      .image=${pictureUrl}
      .hass=${this.hass}

    ></hui-image>`;
  }

  protected renderIcon () {
    return html`
      <ha-tile-icon>
        <ha-state-icon
          slot="icon"
          .icon=${this.item?.icon}
          .hass=${this.hass}
        ></ha-state-icon>
      </ha-tile-icon>`;
  }
}

export {
  BaseItemElement
};
