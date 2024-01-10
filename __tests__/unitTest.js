/**
 * @jest-environment jsdom
 */


describe("Memory tests", function() {


    it("Test if object is being released", async function() {
        let released = false
        const registerFinalizer = new FinalizationRegistry((_) => {
            released = true
        });
        // let savedNodes = []

        const insertSubTree = () => {
            const subtreeDepth = 10;
            const parentNode = document.createElement('div');
            const randomString = (Math.random() + 1).toString(36).substring(7);
            for (let i = 1; i <= subtreeDepth; i++) {
                const childNode = document.createElement('div');
                childNode.id = `${randomString}-${i}`;
                parentNode.appendChild(childNode);
            }
            registerFinalizer.register(parentNode, null);
            // savedNodes.push(parentNode)
            let container = document.getElementById('container')
            container.innerHTML = parentNode.innerHTML
        };


        window.document.body.innerHTML = `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <title>Home</title>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width" />
          
              <script type="module" src="script.js"></script>
            </head>
            <body>
              <main>
                <h1>Memory - Danger!</h1>
                <div id="container"></div>
                <button onclick="insertSubTree()">Add html subtree</button>
              </main>
            </body>
          </html>
    `;
        insertSubTree()
        let childNodesCount = document.getElementById('container').childNodes.length
        await timeout(500)
        global.gc() // trigger the garbage collector



        expect(released).toEqual(true)
        expect(childNodesCount).toEqual(10)


    });


});

function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}