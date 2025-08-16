/**
 * Copyright (c) Freelens Authors. All rights reserved.
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./input-dialog.scss";

import { Button } from "@freelensapp/button";
import { Icon } from "@freelensapp/icon";
import { Input } from "@freelensapp/input";
import { showErrorNotificationInjectable } from "@freelensapp/notifications";
import { cssNames, noop, prevDefault } from "@freelensapp/utilities";
import { withInjectables } from "@ogre-tools/injectable-react";
import { computed, makeObservable, observable } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { Dialog } from "../dialog";
import inputDialogStateInjectable from "./state.injectable";

import type { ButtonProps } from "@freelensapp/button";
import type { ShowNotification } from "@freelensapp/notifications";
import type { StrictReactNode } from "@freelensapp/utilities";
import type { IObservableValue } from "mobx";
import type { DialogProps } from "../dialog";

export interface InputDialogProps extends Partial<DialogProps> {}

export interface InputDialogParams extends InputDialogBooleanParams {
  onSuccess?: (value: string) => any | Promise<any>;
  onCancel?: () => any | Promise<any>;
}

export interface InputDialogBooleanParams {
  labelOk?: StrictReactNode;
  labelCancel?: StrictReactNode;
  message: StrictReactNode;
  placeholder?: string;
  icon?: StrictReactNode;
  okButtonProps?: Partial<ButtonProps>;
  cancelButtonProps?: Partial<ButtonProps>;
}

interface Dependencies {
  state: IObservableValue<InputDialogParams | undefined>;
  showErrorNotification: ShowNotification;
}

const defaultParams = {
  onSuccess: noop,
  onCancel: noop,
  labelOk: "Ok",
  labelCancel: "Cancel",
  placeholder: "",
  icon: <Icon big material="edit" />,
};

@observer
class NonInjectedInputDialog extends React.Component<InputDialogProps & Dependencies> {
  @observable isSaving = false;
  @observable value = "";

  constructor(props: InputDialogProps & Dependencies) {
    super(props);
    makeObservable(this);
  }

  @computed
  get params() {
    return Object.assign({}, defaultParams, this.props.state.get() ?? ({} as InputDialogParams));
  }

  onSuccess = async () => {
    try {
      this.isSaving = true;
      await (async () => this.params.onSuccess(this.value))();
    } catch (error) {
      this.props.showErrorNotification(
        <>
          <p>Confirmation action failed:</p>
          <p>
            {error instanceof Error
              ? error.message
              : typeof error === "string"
                ? error
                : "Unknown error occurred while ok-ing"}
          </p>
        </>,
      );
    } finally {
      this.isSaving = false;
      this.props.state.set(undefined);
    }
  };

  onClose = () => {
    this.isSaving = false;
    this.value = "";
  };

  close = async () => {
    try {
      await Promise.resolve(this.params.onCancel());
    } catch (error) {
      this.props.showErrorNotification(
        <>
          <p>Cancelling action failed:</p>
          <p>
            {error instanceof Error
              ? error.message
              : typeof error === "string"
                ? error
                : "Unknown error occurred while cancelling"}
          </p>
        </>,
      );
    } finally {
      this.isSaving = false;
      this.props.state.set(undefined);
    }
  };

  render() {
    const { state, className, ...dialogProps } = this.props;
    const isOpen = Boolean(state.get());
    const { icon, labelOk, labelCancel, message, placeholder, okButtonProps = {}, cancelButtonProps = {} } = this.params;

    return (
      <Dialog
        {...dialogProps}
        className={cssNames("InputDialog", className)}
        isOpen={isOpen}
        onClose={this.onClose}
        close={this.close}
        {...(isOpen ? { "data-testid": "input-dialog" } : {})}
      >
        <div className="input-dialog-content">
          {icon} {message}
        </div>
        <Input
          autoFocus
          placeholder={placeholder}
          value={this.value}
          onChange={(v) => (this.value = v)}
          onEnter={this.onSuccess}
        />
        <div className="confirm-buttons">
          <Button
            plain
            className="cancel"
            label={labelCancel}
            onClick={prevDefault(this.close)}
            {...cancelButtonProps}
          />
          <Button
            primary
            className="ok"
            label={labelOk}
            onClick={prevDefault(this.onSuccess)}
            waiting={this.isSaving}
            data-testid="confirm"
            {...okButtonProps}
          />
        </div>
      </Dialog>
    );
  }
}

export const InputDialog = withInjectables<Dependencies, InputDialogProps>(NonInjectedInputDialog, {
  getProps: (di, props) => ({
    ...props,
    state: di.inject(inputDialogStateInjectable),
    showErrorNotification: di.inject(showErrorNotificationInjectable),
  }),
});
