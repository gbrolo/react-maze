import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import ArrowKeysReact from 'arrow-keys-react';
import './styles.css';

// https://digitalsynopsis.com/design/beautiful-color-palettes-combinations-schemes/

const Cell = (props) =>{
    return(
        <div className={ 
            "cell " 
            + (props.props.top === "*" ? 'top-wall ' : '') 
            + (props.props.bottom === "*" ? 'bottom-wall ' : '')
            + (props.props.left === "*" ? 'left-wall ' : '')
            + (props.props.right === "*" ? 'right-wall ' : '')
            + (props.props.type === 'start' ? 'start-cell ' : '')
            + (props.props.type === 'end' ? 'end-cell ' : '')
            + (props.props.player === true ? 'player' : '') }>
        </div>
    )
}

class Main extends Component {
    constructor(props) {
        super(props);        

        this.state = {
            renderMaze: false,
            cellsArray: [],
            currentCell: {},
            won: false
        }

        ArrowKeysReact.config({
            left: () => {
                this.handleKeyLeft();              
            },
            right: () => {
                this.handleKeyRight();
            },
            up: () => {
                this.handleKeyUp();
            },
            down: () => {
                this.handleKeyDown();
            }
          });
    }

    finishGame() {
        this.setState({ won: true });

        setTimeout(() => {
            this.buildMaze();
            this.setState({ won: false });
        }, 1000);
    }

    updateMaze(previousIndex, nextIndex) {
        var maze = this.state.cellsArray;
        var newCurrentCell = null;

        for (var i = 0; i < maze.length; i++) {
            var currentRow = maze[i];
            for (var j = 0; j < currentRow.length; j++) {
                if (maze[i][j].index === previousIndex) {
                    maze[i][j].player = false;
                }

                if (maze[i][j].index === nextIndex) {
                    maze[i][j].player = true;
                    newCurrentCell = maze[i][j];
                }
            }
        }

        if (newCurrentCell.player && newCurrentCell.type === "end") {
            this.setState({ cellsArray: maze });
            this.finishGame();
        } else {
            this.setState({ cellsArray: maze, currentCell: newCurrentCell });
        }        

    }

    handleKeyDown() {
        const currentCell = this.state.currentCell;
        if (currentCell.bottom === " ") {
            this.updateMaze(currentCell.index, currentCell.bottomIndex);
        }
    }

    handleKeyUp() {
        const currentCell = this.state.currentCell;
        if (currentCell.top === " ") {
            this.updateMaze(currentCell.index, currentCell.topIndex);
        }
    }

    handleKeyLeft() {
        const currentCell = this.state.currentCell;
        if (currentCell.left === " ") {
            this.updateMaze(currentCell.index, currentCell.leftIndex);
        }
    }

    handleKeyRight() {
        const currentCell = this.state.currentCell;
        if (currentCell.right === " ") {
            this.updateMaze(currentCell.index, currentCell.rightIndex);
        }
    }
    
    buildMaze() {
        fetch('http://34.210.35.174:3001/?w=5&h=5')
            .then(response => {
                return response.text();
            })
            .then(rawMaze => {
                console.log(rawMaze);

                var array = [];
                var mazeArray = [];
                for (var i = 0; i < rawMaze.length; i++) {
                    if (rawMaze.charAt(i) != '\n') {
                        array.push(rawMaze.charAt(i));
                    }                    
                }

                for (var i = 0; i < 11; i++) {
                    var newRow = [];
                    for (var j = 0; j < 11; j++) {
                        if (j % 2 == 0) {
                            var val = array.shift();
                            if (val === '+' || val === '|') { val = "*" }
                            newRow.push(val);
                        } else {
                            var cell = array.shift() + array.shift();
                            if (cell === '--') { cell = '*' }
                            else if (cell === '  ') { cell = ' ' }
                            else if (cell === 'p ') { cell = 'p' }
                            else if (cell === ' g') { cell = 'g' }
                            newRow.push(cell);
                        }
                    }

                    mazeArray.push(newRow);
                }

                // traverse array
                var cellsArray = [];
                var index = 0;

                for (var i = 1; i < 11; i++) {
                    if (i % 2 != 0) {
                        var row = [];
                        for (var j = 1; j < 11; j++) {                            
                            var cell = { index, top: '', bottom: '', left: '', right: '', type: 'path', player: false }
    
                            if (mazeArray[i][j] != '*' && j%2 != 0) {
                                cell.left = mazeArray[i][j-1];
                                cell.right = mazeArray[i][j+1];
                                cell.top = mazeArray[i-1][j];
                                cell.bottom = mazeArray[i+1][j];

                                if (mazeArray[i][j] === 'p') { 
                                    cell.type = 'start'; 
                                    cell.player = true;
                                }
                                else if (mazeArray[i][j] === 'g') { cell.type = 'end'; }

                                index++;
                                row.push(cell);
                            }
                        }

                        cellsArray.push(row);
                    }                    
                }

                for (var i = 0; i < cellsArray.length; i++) {
                    var currentRow = cellsArray[i];
                    for (var j = 0; j < currentRow.length; j++) {
                        try { cellsArray[i][j].topIndex = cellsArray[i-1][j].index; } 
                        catch (error) { cellsArray[i][j].topIndex = null; }

                        try { cellsArray[i][j].bottomIndex = cellsArray[i+1][j].index; } 
                        catch (error) { cellsArray[i][j].bottomIndex = null; }

                        try { cellsArray[i][j].leftIndex = cellsArray[i][j-1].index; } 
                        catch (error) { cellsArray[i][j].leftIndex = null; }

                        try { cellsArray[i][j].rightIndex = cellsArray[i][j+1].index; } 
                        catch (error) { cellsArray[i][j].rightIndex = null; }
                    }
                }

                this.setState({ cellsArray, renderMaze: true });
                this.setState({ currentCell: cellsArray[0][0] });
            })
    }

    componentDidMount() {
        window.addEventListener("keydown", function(e) {
            if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                e.preventDefault();
            }
        }, false);    
        
        this.buildMaze();
    }

    render() {
        return (
            <div {...ArrowKeysReact.events} tabIndex="1" className="wrapper">
                {this.state.renderMaze && <Container style={{
                    width: '100vh',
                    height: '100vh',
                    padding: '70px',
                    margin: '40px',
                    backgroundColor: '#251e3e',
                    boxShadow: '10px 10px #1a162b',
                    border: 'solid 5px #221c38'
                }}>

                    <Row style={{ boxShadow: '10px 10px #1a162b' }}>
                    {
                        this.state.cellsArray[0].map((cell, index) => {
                            return(
                                <Col key={ index } style={{ padding: 0, margin: 0 }}>
                                    <Cell props={cell} />
                                </Col>
                            )
                        })
                    }
                    </Row>
                    
                    <Row style={{ boxShadow: '10px 10px #1a162b' }}>
                    {
                        this.state.cellsArray[1].map((cell, index) => {
                            return(
                                <Col key={ index } style={{ padding: 0, margin: 0 }}>
                                    <Cell props={cell} />
                                </Col>
                            )
                        })
                    }
                    </Row>

                    <Row style={{ boxShadow: '10px 10px #1a162b' }}>
                    {
                        this.state.cellsArray[2].map((cell, index) => {
                            return(
                                <Col key={ index } style={{ padding: 0, margin: 0 }}>
                                    <Cell props={cell} />
                                </Col>
                            )
                        })
                    }
                    </Row>

                    <Row style={{ boxShadow: '10px 10px #1a162b' }}>
                    {
                        this.state.cellsArray[3].map((cell, index) => {
                            return(
                                <Col key={ index } style={{ padding: 0, margin: 0 }}>
                                    <Cell props={cell} />
                                </Col>
                            )
                        })
                    }
                    </Row>

                    <Row style={{ boxShadow: '10px 10px #1a162b' }}>
                    {
                        this.state.cellsArray[4].map((cell, index) => {
                            return(
                                <Col key={ index } style={{ padding: 0, margin: 0 }}>
                                    <Cell props={cell} />
                                </Col>
                            )
                        })
                    }
                    </Row>
                    
                </Container>}
                {!this.state.renderMaze && <div>Loading...</div>}
                { this.state.won && <div className="won">You Won!</div> }
            </div>
        );
    }

}

export default Main;