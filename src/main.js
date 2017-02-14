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
    let tableArray = [];

    // 積み上げ成績を出すための配列の作成
    for(let i = 0; i < people.length; i++) {
      let key = people[i];
      peopleArray[key] = [];
    }

    for(let i = 0; i < data.length; i++) {
      let recordedDate = data[i].date;
      let recordedNotes = data[i].notes;
      let tableContent = {};
      tableContent['date'] = recordedDate;
      tableContent['notes'] = recordedNotes;

      for(let j = 0; j < data[i].record.length; j++) {
        let eachRecord = data[i].record[j];
        peopleArray[eachRecord.name].push({
          'date': recordedDate,
          'score': eachRecord.score
        });
        tableContent[eachRecord.name] = eachRecord.score;
      }
      tableArray.push(tableContent);
    }

    for(let k = 0; k < people.length; k++) {
      let lastValue = 0;
      let records = peopleArray[people[k]];

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

    let dataArray = [];
    for(let m = 0; m < people.length; m++) {
      dataArray[m] = MG.convert.date(peopleArray[people[m]], 'date');
    }

    MG.data_graphic({
      title: '累積スコア遷移',
      description: '記録開始から今日に至るまでの累積スコアです。',
      data: dataArray,
      height: 300,
      full_width: true,
      target: '#root',
      legend_target: '.legend',
      legend: people,
      x_accessor: 'date',  // the key that accesses the x value
      y_accessor: 'score', // the key that accesses the y value
      y_label: '累積スコア'
    });

    let dataArray2 = [];
    // 一人ごとの配列, dateとscoreが入っているオブジェクト
    for (let arr of dataArray) {
      for (let n = 0; n < arr.length; n++) {
        dataArray2.push({date: arr.date, record: []});
      }
    }

    MG.data_table({
        title: "戦歴",
        description: "A table is often the most appropriate way to present data. We aim to make the creation of data tables very simple. We are working on implementing sparklines, bullet charts, and other niceties.",
        data: tableArray,
        show_tooltips: true
    })
    .target('#table')
    .title({accessor: 'date', label: 'Date', width: 50})
    .number({accessor: 'Mot', label: 'Mot', width: 50})
    .number({accessor: 'Jin', label: 'Jin', width: 50})
    .number({accessor: 'Koj', label: 'Koj', width: 50})
    .number({accessor: 'End', label: 'End', width: 50})
    .number({accessor: 'Shk', label: 'Shk', width: 50})
    .number({accessor: 'Oka', label: 'Oka', width: 50})
    .number({accessor: 'Yam', label: 'Yam', width: 50})
    .number({accessor: 'Kos', label: 'Kos', width: 50})
    .number({accessor: 'Ogu', label: 'Ogu', width: 50})
    .text({accessor: 'notes', label: 'Notes', width: 100})
    .display();
  });
});

new Vue({
  el: '#app',
  render: h => h(App)
});
