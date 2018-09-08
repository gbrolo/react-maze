import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
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
            cellsArray: []
        }
    }

    componentDidMount() {
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

                //console.log(mazeArray);

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

                console.log(cellsArray);
                this.setState({ cellsArray, renderMaze: true });
            })        
    }

    render() {
        return (
            <div className="wrapper">
                {this.state.renderMaze && <Container style={{
                    width: '100vh',
                    height: '100vh',
                    padding: '40px',
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
                {!this.state.renderMaze && <div>Loading</div>}
            </div>
        );
    }

}

export default Main;