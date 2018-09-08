import React, { Component } from 'react';
import './styles.css';

class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cellsArray: []
        }
    }

    componentWillMount() {
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

                for (var i = 1; i < 11; i++) {
                    if (i % 2 != 0) {
                        var row = [];
                        for (var j = 1; j < 11; j++) {                            
                            var cell = { top: '', bottom: '', left: '', right: '', type: 'path', player: false }
    
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

                                row.push(cell);
                            }
                        }

                        cellsArray.push(row);
                    }                    
                }

                console.log(cellsArray);
                this.setState({ cellsArray });
            })        
    }

    render() {
        return (
            <div className="wrapper">
                
            </div>
        );
    }

}

export default Main;