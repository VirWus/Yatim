import React from "react";

function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

export default class Clock extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      date: ``
    };
  }

  startTime() {
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    const today = new Date();
    const h = today.getHours();
    const m = checkTime(today.getMinutes());
    const s = checkTime(today.getSeconds());
    const day = weekday[today.getDay()];
    const date = today.getDate(); 
    const month = today.getMonth()+1;
    const year = today.getFullYear();

    this.setState({ date: day + " " + date + " / " + month + " / " + year +" "+ h + ":" + m + ":" + s });
    this.timeout = setTimeout(() => this.startTime(), 500);
  }

  componentDidMount() {
    this.startTime();
  }
  componentWillUnmount() {
    if (!this.timeout) return;
    clearTimeout(this.timeout);
  }
  render() {
    return <h5>{this.state.date}</h5>;
  }
}
