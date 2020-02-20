requirejs.config({
    baseUrl: '',
    paths: {
        'GraphEditor':'./../build/GraphEditor'
    }
});

let editor;
requirejs(['GraphEditor'], function(GraphEditor) {
    console.log('starting application...');
    editor = new GraphEditor.GraphEditor('editor', {
        width: 800,
        height: 600,
        zoom: 1
    });
    editor.domManager.injectDOM('content');

    const node = new GraphEditor.Node(editor.canvasManager.rootStage, 30, 40, {radius: 15});
    const cp = new GraphEditor.ControlBox(node);
    node.validateControlBoxSizing = function(width, height) { return {width: Math.max(100, width), height: Math.max(50, height)}; }

    editor.canvasManager.rootStage.addElement(node);
    editor.canvasManager.rootStage.addElement(cp);
});