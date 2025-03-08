const setUpArray = (colAmt, rowAmt, n) => {
    document.getElementById("grid").innerHTML = "";
    document.getElementById("status").src = "./assets/standard.png";
    document.getElementById("grid").style.setProperty("grid-template-columns", `repeat(${colAmt}, 2rem)`);

    let field = [];
    let bombs = [];

    const setLeftClick = (e) => { 
        let element = e.target;

        if (element.nodeName != "BUTTON") {
            element = element.parentNode;
        }

        console.log(`row: ${element.getAttribute("row")} col: ${element.getAttribute("col")}`);
        
        if (element.value == 0) {
            revealValuesAround(element);   
        } else {
            revealTile(element);
        }

        // checking for win state
        let allFound = true;
        field.forEach(row => {
            row.forEach(element => {
                if (element.getAttribute("revealed") == "false" && element.value != -1) {
                    allFound = false;
                }
            });
        });

        if (allFound) {
            document.getElementById("status").src = "./assets/win.png";
            removeListeners();
        }
    }

    const setRightClick = (e) => {
        let element = e.target;

        if (element.nodeName != "BUTTON") {
            element = element.parentNode;
        }

        let current = element.getAttribute("userInfo");

        switch (current) {
            case "":
                element.innerHTML = `<img src="./assets/flag.png" class="tile-img" alt="flag"></img>`
                element.setAttribute("userInfo", "flag");
                break;
            case "flag":
                element.innerHTML = `<p class="tile-img">?</p>`
                element.setAttribute("userInfo", "question");
                break;
            case "question":
                element.innerHTML = `<p class="tile-img"></p>`
                element.setAttribute("userInfo", "");
                break;
            default:
                break;
        }
        e.preventDefault();
    }

    const removeListeners = () => {
        field.forEach(row => {
            row.forEach(element => {
                element.removeEventListener("click", setLeftClick);
                element.removeEventListener("contextmenu", setRightClick);
            });
        });
    }

    const revealTile = (tile) => {
        if (tile.value != 0 && tile.value != -1) {
            tile.innerHTML = `<p>${tile.value}</p>`;
        }
        
        tile.setAttribute("revealed", true);
        tile.removeEventListener("click", setLeftClick);
        tile.removeEventListener("contextmenu", setRightClick);
        tile.style.border = "1px #8a8b92 solid";

        if (tile.value == -1) {
            tile.style.background = "#ff0000";

            document.querySelectorAll(".bombs").forEach(element => {
                element.style.visibility = "visible"; 
            });

            document.getElementById("status").src = "./assets/lose.png";
            removeListeners();
        }
    }

    const revealValuesAround = (tile) => {
        let tileRow = Number(tile.getAttribute("row"));
        let tileCol = Number(tile.getAttribute("col"));
        
        let rowStart = (tileRow - 1 >= 0) ? tileRow - 1 : tileRow;
        let rowEnd = (tileRow + 1 < rowAmt) ? tileRow + 1 : tileRow;


        let colStart = (tileCol - 1 >= 0) ? tileCol - 1 : tileCol;
        let colEnd = (tileCol + 1 < colAmt) ? tileCol + 1 : tileCol;

        for (let row = rowStart; row <= rowEnd; row++) {
            for (let col = colStart; col <= colEnd; col++) {
                if (field[row][col].getAttribute("revealed") == "false" && Number(field[row][col].value) == 0) {
                    revealTile(field[row][col]);
                    revealValuesAround(field[row][col]);
                } else {
                    revealTile(field[row][col]);
                }
            }
        }
    }

    const createTiles = () => {
        for (let row = 0; row < rowAmt; row++) {
            field[row] = [];
            for (let col = 0; col < colAmt; col++) {
                let button = `<button id="${row}-${col}" row=${row} col=${col} userInfo="" revealed=false value=0 ><p class="blank">0</p></button>`;
                document.getElementById(`grid`).insertAdjacentHTML("beforeend", button);
                field[row][col] = document.getElementById(`${row}-${col}`);

                field[row][col].addEventListener("click", setLeftClick);
                field[row][col].addEventListener("contextmenu", setRightClick);
            }
        }
    }

    const setBombs = () => {
        while (n > 0) {
            let row = Math.floor(Math.random() * rowAmt);
            let col = Math.floor(Math.random() * colAmt);

            if (field[row][col].value == 0) {
                field[row][col].value = -1;
                field[row][col].innerHTML = `<img src="./assets/bomb.png" class="bombs" alt="bombs">`;
                bombs.push(field[row][col]);
                n--;
            }
        }
    }

    const setValues = (tile) => {
        let row = Number(tile.getAttribute("row"));
        let col = Number(tile.getAttribute("col"));

        let rowStart = (row - 1 >= 0) ? row - 1 : row;
        let rowEnd = (row + 1 < rowAmt) ? row + 1 : row;

        let colStart = (col - 1 >= 0) ? col - 1 : col;
        let colEnd = (col + 1 < colAmt) ? col + 1 : col;

        for (let smallRow = rowStart; smallRow <= rowEnd; smallRow++) {
            for (let smallGrid = colStart; smallGrid <= colEnd; smallGrid++) {
                if (Number(field[smallRow][smallGrid].value) != -1) {
                    field[smallRow][smallGrid].value = Number(field[smallRow][smallGrid].value) + 1;
                }
            }
        }
    }

    createTiles();
    setBombs();

    bombs.forEach(element => {
        setValues(element);
    });

    console.log(field);
}

document.getElementById("beginner").addEventListener("click", () => {
    setUpArray(8, 8, 10); 
});

document.getElementById("intermediate").addEventListener("click", () => {
    setUpArray(16, 16, 40); 
});

document.getElementById("expert").addEventListener("click", () => {
    setUpArray(30, 16, 99); 
});

setUpArray(8, 8, 10); // website loads with a beginner game open
