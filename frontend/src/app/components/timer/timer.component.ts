import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {

  timeRemaining = "02:00";
  duration = 120;
  interval;
  timesUp = false;
  isRunning = false;
  audio: HTMLAudioElement;

  constructor() { }

  ngOnInit() {

  }

  playAudio() {
    this.audio = new Audio();

    this.audio.src = "./../../assets/audio/draft-round.mp3";
    this.audio.load();
    this.audio.play();
  }

  startTimer() {
    if (!this.isRunning) {
      this.clear(this.interval);
      this.timer(this.duration); 
    }

    this.playAudio();
  }

  pauseTimer() {
    this.isRunning = false;
    this.clear(this.interval);

    this.audio.pause();
  }

  resetTimer() {
    this.clear(this.interval)

    this.timeRemaining = "02:00";
    this.duration = 120;

    this.isRunning = false;
    this.timesUp = false;
  }

  timer(remaining: number) {
    this.isRunning = true;
    this.interval = setInterval(() => {
      if (remaining == 0) {
        this.timeRemaining = '00:00';
        this.timesUp = true;
      }
      
      let minutes = Math.floor(remaining / 60);
      let seconds = remaining % 60;

      if (seconds < 10) {
        this.timeRemaining = '0' + minutes + ':' + '0' + seconds;
      } else {
        this.timeRemaining = '0' + minutes + ':' + seconds;
      }
      
      this.duration = remaining;
      remaining--;

    }, 1000)
  }

  clear(interval) {
    if (this.interval) {
      clearInterval(interval);
    }
  }

}
