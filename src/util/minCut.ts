function bfs(rGraph: number[][], s: number, t: number, parent: number[]): boolean {
    const visited: boolean[] = new Array(rGraph.length).fill(false);
    const q: number[] = [];

    q.push(s);
    visited[s] = true;
    parent[s] = -1;

    while(q.length){
        const v: number = q.shift()!;
        for (let i = 0; i < rGraph.length; i++) {
            if (rGraph[v][i] > 0 && !visited[i]) {
                q.push(i);
                visited[i] = true;
                parent[i] = v;
            }
        }
    }

    return visited[t];
}

function dfs(rGraph: number[][], s: number, visited: boolean[]): void {
    visited[s] = true;

    for (let i = 0; i < rGraph.length; i++) {
        if (rGraph[s][i] > 0 && !visited[i]) {
            dfs(rGraph, i, visited);
        }
    }
}

export function minCut(graph: number[][], s: number, t: number): [number, number][] {
    let u: number;
    let v: number;

    const ret: [number, number][] = [];

    const rGraph: number[][] = graph.map(row => [...row]);
    const parent: number[] = new Array(graph.length);

    while(bfs(rGraph, s, t, parent)){
        let pathFlow: number = Number.MAX_VALUE;
        for (v = t; v !== s; v = parent[v]) {
            u = parent[v];
            pathFlow = Math.min(pathFlow, rGraph[u][v]);
        }

        for (v = t; v !== s; v = parent[v]) {
            u = parent[v];
            rGraph[u][v] -= pathFlow;
            rGraph[v][u] += pathFlow;
        }
    }

    const isVisited: boolean[] = new Array(graph.length).fill(false);
    dfs(rGraph, s, isVisited);

    for (let i = 0; i < graph.length; i++) {
        for (let j = 0; j < graph.length; j++) {
            if (graph[i][j] > 0 && isVisited[i] && !isVisited[j]) {
                // console.log(i + " - " + j + "<br>");
                ret.push([i, j]);
            }
        }
    }
    return ret;
}