export default {
  ForDataTimes:function(val){
    var Datas=val.slice(0,19)
    return Datas
  },
  GetData:function(type){
    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (type === 'start') {
      year = year - 60;
    } else if (type === 'end') {
      year = year + 2;
    }
    month = month > 9 ? month : '0' + month;;
    day = day > 9 ? day : '0' + day;
    return `${year}-${month}-${day}`;
  },
  Fun_Data:function(val){
    var date1 = new Date(),
    time1=date1.getFullYear()+"-"+(date1.getMonth()+1)+"-"+date1.getDate();//time1表示当前时间
    var date2 = new Date(date1);
    date2.setDate(date1.getDate()+val);
    let month = date2.getMonth() + 1;
    let day = date2.getDate();
    month = month > 9 ? month : '0' + month;;
    day = day > 9 ? day : '0' + day;
    var time2 = date2.getFullYear()+"-"+month+"-"+day;
    return time2;
  },
}
