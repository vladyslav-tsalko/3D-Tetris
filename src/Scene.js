class Scene{
    static shapesNames = ['tetraCubeI', 'tetraCubeO', 'tetraCubeL', 'tetraCubeT', 'tetraCubeN', 'tetraCubeTowerLeft', 'tetraCubeTowerRight','tetraCubeTripod'];

    static shapesColors = [
        [1, 0, 0],//red
        [1, 0.5, 0],//orange
        [1, 1, 0],//yellow
        [0, 1, 0],//green
        [0, 1, 1],//baby blue
        [0, 0, 1],//blue
        [0.5, 0, 1],//purple
        [1, 0, 1],//pink
    ];
    
    constructor() {
       /** @type {BufferCube} */
        let mainBufferCube = null;
        
        this.tetraCubes = [];

        this.filled = {
            'xy': new Array(Grid.dimensions.width).fill(0),
            'yz': new Array(Grid.dimensions.width).fill(0),
            'xz': new Array(Grid.dimensions.height).fill(0),
        }
    }
    add(tetraCube){
        this.tetraCubes.push(tetraCube)
        tetraCube.cubeOrigins.forEach(tetraCubeOrigin => {
            this.filled.xy[(tetraCubeOrigin[2] - 1)/2]++;
            this.filled.yz[(tetraCubeOrigin[0] - 1)/2]++;
            this.filled.xz[(tetraCubeOrigin[1] - 1)/2]++;
        });
        const [numbers, vecIndex] = this.#filledPlane();
        if(numbers.length !== 0){
            this.#removeFilledPlane(numbers, vecIndex);
        }
    }

    clear(){
        this.#clearFilledInfo();
        this.#clearTetraCubes();
    }

    isEmpty(){
        if(this.tetraCubes.length === 0){
            true;
        }
        else{
            false;
        }
    }
    
    draw(){
        if(!this.isEmpty()){
            this.tetraCubes.forEach(tetraCube => {
                tetraCube.draw();
            });
        }
    }

    async parseCube(){
        const cubeRaw = await this.#loadData('Objects/cube.obj');
        const [vertices, normals, boundingVertices] = parseOBJ(cubeRaw);
        this.mainBufferCube = new BufferCube(vertices, normals, boundingVertices);
    }

    #clearFilledInfo(){
        for(let i = 0; i < this.filled.xy.length; i++){
            this.filled.xy[i] = 0;
        }
        for(let i = 0; i < this.filled.xz.length; i++){
            this.filled.xz[i] = 0;
        }
        for(let i = 0; i < this.filled.yz.length; i++){
            this.filled.yz[i] = 0;
        }
    }

    #clearTetraCubes(){
        while (this.tetraCubes.length > 0) {
            this.tetraCubes.pop();
        }
    }

    #removeFilledPlane(numbers, vecIndex){
        let removedCubeOrigins = [];
        for(const number of numbers){
            let vector = new Array(3).fill(0);
            vector[vecIndex] = number;
            for(let i = this.tetraCubes.length - 1; i>=0; i--){
                removedCubeOrigins.push(this.tetraCubes[i].removeCubes(vector));
                if(this.tetraCubes[i].isEmpty()){
                    this.tetraCubes.splice(i, 1);
                }
            }
        }
        if(removedCubeOrigins.length !== 0){
            for (let i = 0; i < removedCubeOrigins.length; i++) {
                for (let j = 0; j < removedCubeOrigins[i].length; j++) {
                    this.filled.xy[(removedCubeOrigins[i][j][2] - 1)/2]--;
                    this.filled.yz[(removedCubeOrigins[i][j][0] - 1)/2]--;
                    this.filled.xz[(removedCubeOrigins[i][j][1] - 1)/2]--;
                }
            }
        }
        
        if(vecIndex == 1){
            let removedCubeOriginsY = [];
            let addedCubeOriginsY = [];
            const max = Math.max(...numbers);
            this.tetraCubes.forEach(tetraCube => {
                const [remY, addY] = tetraCube.fall([0, -2*numbers.length, 0], max);
                removedCubeOriginsY.push(remY.flat());
                addedCubeOriginsY.push(addY.flat());
            });
            for (let i = 0; i < removedCubeOriginsY.length; i++) {
                for (let j = 0; j < removedCubeOriginsY[i].length; j++) {
                    let a = removedCubeOriginsY[i][j];
                    let b = (a - 1)/2;
                    this.filled.xz[b]--;
                }
            }
            for (let i = 0; i < addedCubeOriginsY.length; i++) {
                for (let j = 0; j < addedCubeOriginsY[i].length; j++) {
                    let a = addedCubeOriginsY[i][j];
                    let b = (a - 1)/2;
                    this.filled.xz[b]++;
                }
            }

        }
        
    }

    #filledPlane(){
        let xyPos = [];
        let xzPos = [];
        let yzPos = [];
        for(let i = 0; i<this.filled.xy.length; i++){
            if(this.filled.xy[i] === Grid.dimensions.width * Grid.dimensions.height){
                xyPos.push(i*2 + 1);
            }
        }
        if(xyPos.length !== 0){
            return [xyPos, 2];
        }
        for(let i = 0; i<this.filled.xz.length; i++){
            if(this.filled.xz[i] === Grid.dimensions.width * Grid.dimensions.width){
                xzPos.push(i*2 + 1);
            }
        }
        if(xzPos.length !== 0){
            return [xzPos, 1];
        }
        for(let i = 0; i<this.filled.yz.length; i++){
            if(this.filled.yz[i] === Grid.dimensions.width * Grid.dimensions.height){
                yzPos.push(i*2 + 1);
            }
        }
        if(yzPos.length !== 0){
            return [yzPos, 0];
        }
        return [[], 0];
    }


    async #loadData(fileName) {
        const Object = await fetch(fileName).then(result => result.text());
        return Object;
    }
}