requirejs.config({
    baseUrl: '',
    paths: {
        'GraphEditor':'./../build/grapheditor'
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

    const node = new GraphEditor.Node(editor.canvasManager.rootStage, {
        radius: 15,
        boundingBox: { x: 30, y: 40, width: 100, height: 50 }
    });

    editor.canvasManager.rootStage.addElement(node);
});