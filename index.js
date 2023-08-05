const COLORS = ['#0096FF', '#FF7E79', '#008F00', '#FF9300', '#ffd700', '#D6D6D6', '#D783FF'];
let isDirected = false;
let cy = null; // Cytoscape instance

function show_message(message) {
    let message_area = document.getElementById('message');
    console.log(message_area);
    console.log(message);
    message_area.className = 'error';
    message_area.innerText = message;
    
}

function toggleDirected() {
  isDirected ^= true;
  const button = document.getElementById('directedButton');
  button.textContent = isDirected ? "Directed" : "Undirected";
  draw();
}

function changeColor(colorIndex) {
        const selectedNodes = cy.$('node:selected');
        const selectedEdges = cy.$('edge:selected');

        if (selectedNodes.length > 0) {
            selectedNodes.style('background-color', COLORS[colorIndex]);
        }

    if (selectedEdges.length > 0) {
        selectedEdges.style('line-color', COLORS[colorIndex]);
        selectedEdges.style('target-arrow-color', COLORS[colorIndex]);
    }
}


function draw() {
    // 入力を取得
    const input = document.getElementById('input').value.trim().split('\n');
    const nm = input[0].split(' ').map(Number);
    const n = nm[0], m = nm[1] ? nm[1] : input.length - 1;

    // ノードとエッジを初期化
    const nodes = [];
    for (let i = 1; i <= n; i++) {
        nodes.push({data: {id: i.toString(), name: i.toString()}});
    }
    
    if (input.length - 1 > m) {
        show_message("入力が多すぎます");
        return;
    }

    const edges = [];
    for (let i = 1; i <= m; i++) {
        let uvw;
        try {
            uvw = input[i].split(' ').map(Number);    
        } catch (error) {
            console.error("入力がパースできませんでした")
            show_message("入力が足りません");
            return;
        }
        
        if (uvw.length < 2 || 3 < uvw.length) {
            show_message("入力形式がおかしいです")
            return;
        }
        
        if (uvw[0] < 0 || n < uvw[0] || uvw[1] < 0 || n < uvw[1]) {
            show_message("指定した頂点数を超えています");
            return;
        }
        
        let edge = {
            data: {
                id: 'e' + i,
                source: uvw[0].toString(),
                target: uvw[1].toString(),
                label: uvw.length === 3 ? uvw[2].toString() : '',
            },
            style: {
                'line-color': '#0096FF',
                'target-arrow-shape': isDirected ? 'triangle' : 'none',
                'target-arrow-color': isDirected ? '#2B7CE9' : 'none'  
            }
        };
        if (isDirected) {
            edge['style']['target-arrow-shape'] = 'triangle';
            edge['style']['target-arrow-color'] = '#0096FF';
        } else {
            edge['style']['target-arrow-shape'] = 'none';
        }
        edges.push(edge);
    }
    
    if (cy) { cy.destroy(); }

    // cytoscape のインスタンスを作成
    cy = cytoscape({
        container: document.getElementById('cy'),
        elements: {
            nodes: nodes,
            edges: edges,
        },
        layout: {
            name: 'random'
        },
        style: cytoscape.stylesheet()
            .selector('node')
            .css({
                'background-color': '#0096FF',
                'label': 'data(name)',
            })
            .selector('edge')
            .css({
                'curve-style': 'bezier',
                'target-arrow-shape': 'data(directed)',
                'target-arrow-color': 'black',
                'line-color': '#2B7CE9',
                'label': 'data(label)',
            }),
    });
}



window.onload = function() {
  const colorContainer = document.getElementById('color-buttons');
  for (let i = 0; i < COLORS.length; i++) {
    const colorButton = document.createElement('button');
    colorButton.className = "color-button";
    colorButton.onclick = function() { changeColor(i); };
    colorButton.style.backgroundColor = COLORS[i];
    colorContainer.appendChild(colorButton);
  }
}