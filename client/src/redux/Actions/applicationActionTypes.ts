export const MODAL_OPEN = 'MODAL_OPEN';
export const MODAL_CLOSE = 'MODAL_CLOSE';
export const CHANGE_THEME = 'CHANGE_THEME';

export type ModalType = {
    modalOpen: boolean;
    modalType?: string;
};

export type ApplicationType = {
    applicationTheme: string;
    modal: ModalType;
};

export interface OpenModal {
    type: typeof MODAL_OPEN;
    payload: {
        modalType: string;
    };
}

export interface CloseModal {
    type: typeof MODAL_CLOSE;
}

export interface ChangeTheme {
    type: typeof CHANGE_THEME;
    payload: string;
}

export type ApplicationDispatchType = OpenModal | CloseModal | ChangeTheme;
