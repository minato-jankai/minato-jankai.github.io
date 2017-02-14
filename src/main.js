import Vue from 'vue';
import App from './App.vue';
import MG from 'metrics-graphics';

// bootstrap, d3はes6 importには対応していないのでrequireする
require('bootstrap');
require('bootstrap/dist/css/bootstrap.css');
require('metrics-graphics/dist/metricsgraphics.css');
let d3 = require('d3');

d3.json('/data/records.json', (data) => {
  d3.json('/data/people.json', (people) => {
    let peopleArray = {};

    // 積み上げ成績を出すための配列の作成
    for(let i = 0; i < people.length; i++) {
      let key = people[i];
      peopleArray[key] = [];
    }

    for(let i = 0; i < data.length; i++) {
      let recordedDate = data[i].date;

      for(let j = 0; j < data[i].record.length; j++) {
        let eachRecord = data[i].record[j];
        peopleArray[eachRecord.name].push({
          'date': recordedDate,
          'score': eachRecord.score
        });
      }
    }

    console.dir(peopleArray);

    for(let k = 0; k < people.length; k++) {
      let lastValue = 0;
      let records = peopleArray[people[k]];

      console.log(people[k]);
      console.dir(peopleArray[people[k]]);
      for(let l = 0; l < records.length; l++) {
        records[l].score = records[l].score + lastValue;
        lastValue = records[l].score;
      }

      // グラフ表示用ダミーデータ挿入
      let currentDate = new Date();
      let formattedDate = currentDate.getFullYear() + '-' + currentDate.getMonth() + '-' + currentDate.getDay();
      records.push({
        'date': formattedDate,
        'score': lastValue
      });
      peopleArray[people[k]] = records;
    }

    console.dir(peopleArray);

    let dataArray = [];
    for(let m = 0; m < people.length; m++) {
      dataArray[m] = MG.convert.date(peopleArray[people[m]], 'date');
    }

    MG.data_graphic({
      title: '累積スコア遷移',
      description: '記録開始から今日に至るまでの累積スコアです。',
      data: dataArray,
      width: 600,
      height: 300,
      target: '#root',
      legend_target: '.legend',
      legend: people,
      x_accessor: 'date',  // the key that accesses the x value
      y_accessor: 'score', // the key that accesses the y value
      y_label: '累積スコア'
    });
  });
});

new Vue({
  el: '#app',
  render: h => h(App)
});
