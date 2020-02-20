export enum Cursor {
    // General
    DEFAULT = 'default',
    NONE = 'none',
    
    // Links and status
    CONTEXT_MENU = 'context-menu',
    HELP = 'help',
    POINTER = 'pointer',
    PROGRESS = 'progress',
    WAIT = 'wait',

    // Selection
    CELL = 'cell',
    CROSSHAIR = 'crosshair',
    TEXT = 'text',
    VERTICAL_TEXT = 'vertical-text',

    // Drag & drop
    ALIAS = 'alias',
    COPY = 'copy',
    MOVE = 'move',
    NO_DROP = 'no-drop',
    NOT_ALLOWED = 'not-allowed',
    GRAB = 'grab',
    GRABBING = 'grabbing',

    // Resizing and scrolling
    ALL_SCROLL = 'all-scroll',
    COL_RESIZE = 'col-resize',
    ROW_RESIZE = 'row-resize',
    N_RESIZE = 'n-resize',
    E_RESIZE = 'e-resize',
    W_RESIZE = 'w-resize',
    S_RESIZE = 's-resize',
    NE_RESIZE = 'ne-resize',
    NW_RESIZE = 'nw-resize',
    SE_RESIZE = 'se-resize',
    SW_RESIZE = 'sw-resize',
    EW_RESIZE = 'ew-resize',
    NS_RESIZE = 'ns-resize',
    NESW_RESIZE = 'nesw-resize',
    NWSE_RESIZE = 'nwse-resize',

    // Zooming
    ZOOM_IN = 'zoom-in',
    ZOOM_OUT = 'zoom-out'
}