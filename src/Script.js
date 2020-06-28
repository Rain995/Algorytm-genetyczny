import React, { useState, useReducer } from "react";
import "./App.css";
import { Container, Button } from "react-bootstrap";
import Inputs from "./components/Inputs/Inputs";
import Paragraph from "./components/paragraph";

const initialState = {
  populationSize: 20,
  result: 50000,
  iterations: 100,
  mutations: 0.1,
  cross: 0.75
};

const inputReducer = (state, action) => {
  const value = action.value;
  switch (action.type) {
    case "populationSize":
      return {
        ...state,
        populationSize: value
      };
    case "result":
      return {
        ...state,
        result: value
      };
    case "iterations":
      return {
        ...state,
        iterations: value
      };
    case "mutations":
      return {
        ...state,
        mutations: value
      };
    case "cross":
      return {
        ...state,
        cross: value
      };
    default:
      throw new Error();
  }
};

const Main = () => {
  const [inputState, dispatch] = useReducer(inputReducer, initialState);
  const { populationSize, result, iterations, mutations, cross } = inputState; 
  const [counter, setCounter] = useState();
  const [adaptation, setAdapt] = useState();
  const [endResult, setEndResult] = useState();
  const [endPopulation, setEndPopulation] = useState();

  // tworzenie początkowej populacji
  const createInitialPopulation = () => {
    const startPopulation = [];
    for (let i = 0; i < populationSize; i++) {
      startPopulation.push(Math.floor(Math.random() * 255));
    }
    console.log("Poczatkowa populacja" + startPopulation)
    return startPopulation;
  };

  // adaptacja
  const giveAdaptResult = currentPopulation => { 
    const adaptationArray = []; 
    currentPopulation.forEach(i => {
      adaptationArray.push(4 * Math.sin(i) + 9 * i + 4);
    });
    console.log("wartosc adaptacji" + adaptationArray)
    return adaptationArray;
  };
  const giveSumAdaptResult = adaptationResult => {  
    let sumAdaptation = 0;
    adaptationResult.forEach(i => (sumAdaptation += i)); 
    console.log("suma adaptacji" + sumAdaptation)
    return sumAdaptation;
  };

  // wartości procentowe
  const givePercentAdapt = (adaptationResult, sumAdaptation) => { 
    const percentArray = [];
    adaptationResult.map(i => percentArray.push((i / sumAdaptation) * 100)); 
    console.log("wartosci procentowe: " + percentArray)
    return percentArray;
  };

  // koło ruletki
  const rouletteWheel = (percentAdapt, currentPopulation) => {
    const newPopulation = [];
    const rouletteArray = [];
    let result = 0;
    percentAdapt.forEach(i => rouletteArray.push((result += i)));
    for (let i = 0; i < currentPopulation.length; i++) {
      let random = Math.random() * 100;
      console.log("wylosowana liczba " + random)
      for (let i = 0; i < currentPopulation.length; i++) {
        if (i === 0 && random < rouletteArray[i]) {
          newPopulation.push(currentPopulation[i]);
        } else if (
          i>0 && random>rouletteArray[i - 1] && random<rouletteArray[i]
        ) {
          newPopulation.push(currentPopulation[i]);
        }
      }
    }
    console.log("populajca po selekcji: " + newPopulation)
    return newPopulation;
  };

  // tworzenie stringa
  const createBinaryString = nMask => {
    for (
      var nFlag = 0, nShifted = nMask, sMask = "";
      nFlag < 32;
      nFlag++ , sMask += String(nShifted >>> 31), nShifted <<= 1
    );
    sMask = sMask.replace(/\B(?=(.{8})+(?!.))/g, " ");

    return sMask.slice(-5);
  };

  // krzyżowanie 
  const crosses = nextPopulation => {
    const counterCouple = nextPopulation.length / 2;
    const coupleArray = [];
    let count = 0;
    for (let i = 0; i < counterCouple; i++) {
      coupleArray.push({
        1: nextPopulation[count],
        2: nextPopulation[count + 1]
      });
      count = count + 2;                                    
    }
    let firstChild = "";
    let secondChild = "";
    let populationAfter = [];
    coupleArray.forEach(i => {
      let probability = Math.random();
      if (probability <= cross) {
        const rand = Math.floor(Math.random() * 4) + 1;
        const firstParent = createBinaryString(i[1]);
        const secondParent = createBinaryString(i[2]);
        const firstToReplace = firstParent.substr(rand);
        const secondToReplace = secondParent.substr(rand);
        firstChild = firstParent.slice(0, rand) + secondToReplace;
        secondChild = secondParent.slice(0, rand) + firstToReplace;
        console.log("para poddana krzyzowaniu " + i[1], i[2], "punkt krzyzowania " + rand)
        console.log("pierwszy rodzi c" + firstParent, "po krzyzowaniu " + firstChild)
        console.log("drugi rodzic " + secondParent, "po krzyzowaniu " + secondChild)
        console.log("potomkowie " + parseInt(firstChild, 2), parseInt(secondChild, 2))

        populationAfter.push(parseInt(firstChild, 2), parseInt(secondChild, 2));
        coupleArray.splice(i, 1);
      }
    });
    for (let i = 0; i < coupleArray.length; i++) {
      populationAfter.push(coupleArray[i][1]);
      populationAfter.push(coupleArray[i][2]);
    }
    console.log("populacja po krzyżowanie " + populationAfter)
    return populationAfter;
  };

 //mutacja
  const mutation = populationAfter => { 
    populationAfter.forEach((i, index) => { 
      let prob = Math.random();
      if (prob <= mutations) {
        let point = Math.floor(Math.random() * 5) + 1;
        let parent = createBinaryString(i);
        let before = parent.slice(0, point - 1);
        let after = parent.substring(point);
        let mutated = parent.charAt(point - 1);

        if (!Number(mutated)) {
          mutated = 1;
        } else if (Number(mutated) === 1) {
          mutated = 0;
        }
        
        let mutatedChild = before + mutated + after;
        populationAfter.splice(index, 1, parseInt(mutatedChild, 2));
        console.log("chromosom poddany mutacji " + i, "jego numer(chx): " + index, "Miejsce mutowania: " + point)
        console.log("chromosom poddany mutacji binarnie " + parent)
        console.log("chromosom po mutacj binarnie " + mutatedChild, "dziesiatkowo: " + parseInt(mutatedChild, 2))


      }
    });

    console.log("populacja po mutowanie" + populationAfter)
    return populationAfter;
  };

  const giveBestChromosome = populations => {
    let theBestChromosome = 0;
    populations.forEach(i => i >= theBestChromosome && (theBestChromosome = i));
    let theBestChromosomeAdapt =   4 * Math.sin(theBestChromosome) + 9 * theBestChromosome + 4
    return ["Najlepszy chromosom: " + theBestChromosome, " " + "Jego wartosc przystosowania: " + theBestChromosomeAdapt]
  };



  const onClick = () => {
    let populations = createInitialPopulation();
    let adaptResults = giveAdaptResult(populations);
    let adaptSum = giveSumAdaptResult(adaptResults);
    let counter = 0;
    let BestChromosome = 0;
    while ( counter < iterations) {
      const percentAdaptations = givePercentAdapt(adaptResults, adaptSum);
      const populationAfterRouletteWhell = rouletteWheel(
        percentAdaptations,
        populations
      );
      const populationAfterCross = crosses(populationAfterRouletteWhell);
      const populationAfterMutated = mutation(populationAfterCross);
      populations = populationAfterMutated;
      adaptResults = giveAdaptResult(populationAfterMutated);
      counter++;
      adaptSum = giveSumAdaptResult(adaptResults);
      BestChromosome = giveBestChromosome(populations);
    }
    setEndResult(BestChromosome);
    setEndPopulation(adaptResults);
    setAdapt(adaptSum);
    setCounter(counter);
  };

  return (
    <Container className='mt-4'>
      <Inputs
        handleinput={dispatch}
        populationSize={populationSize}
        result={result}
        iterations={iterations}
        cross={cross}
        mutations={mutations}
      />
      <Button className='mt-4 btn-lg' onClick={onClick}>
        Wykonaj
      </Button>
      <Paragraph>{endResult} </Paragraph>
      <Paragraph
        style={
          adaptation === result
            ? {
              color: "green"
            }
            : {
              color: "red"
            }
        }>
        Suma adaptacji: {adaptation}
      </Paragraph>
      <Paragraph>
        Końcowa populacja:
        {endPopulation &&
          endPopulation.map((i, index) => (
            <p key={index}>
              <span> {i} </span>
            </p>
          ))}
      </Paragraph>
      <Paragraph
        style={
          counter <= iterations
            ? {
              color: "green"
            }
            : {
              color: "red"
            }
        }>
        Ilość pokoleń: {counter}
      </Paragraph>
    </Container>
  );
};

export default Main;