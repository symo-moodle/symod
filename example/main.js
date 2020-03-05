let editor;
window.onload = function() {
    (function(GraphEditor) {
        console.log('starting application...');
        editor = new GraphEditor.GraphEditor((graphEditor) => {
			const selector = new GraphEditor.Selector(graphEditor);
			const zoom = new GraphEditor.Zoom(graphEditor);

			return {
				id: 'editor',
				width: 800,
				height: 600,
				zoom: 1,
				toolGroups: [
					{
						name: 'Basic',
						tools: [
							selector,
							zoom
						]
					}
				],
				defaultTool: selector
			}
		});
        editor.domManager.injectDOM('content');

        editor.canvasManager.rootStage.addElement(new GraphEditor.Rect(editor.canvasManager.rootStage, {
            x: 30, y: 40, width: 100, height: 50
        }));

        let rect1;
        editor.canvasManager.rootStage.addElement(rect1 = new GraphEditor.Rect(editor.canvasManager.rootStage, {
            x: 100, y: 50, width: 200, height: 100,
            fillStyle: {
                gradient: 'lr-gradient',
                stops: [
                    { stop: 0, color: '#ffffff' },
                    { stop: 1, color: '#d3d3d3' }
                ]
            }
        }));

        editor.canvasManager.rootStage.addElement(new GraphEditor.Label(rect1, {
            x: 100, y: 250, width: 200, height: 100, text: 'Alma',
            autoResize: true, minWidth: 100, minHeight: 30
        }));
    })(GraphEditor);
}
