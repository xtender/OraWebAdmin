const socketProtocol = (window.location.protocol === 'https:' ? 'wss:' : 'ws:')
var socket = null;
var running = false;

function logAppend(txt){
    $('#log').val($('#log').val() + txt);
}

function logScroll(){
    $('#log').scrollTop($('#log')[0].scrollHeight);
}

function stopstart() {
    if(running) {
        $("#scImage").attr("src","/images/Play1Normal.png");
        $("#scDiv").text("Execute");
        killScript();
    }else{
        $("#scImage").attr("src","/images/closeNormal.png");
        $("#scDiv").text("Kill");
        runScript();
    }
}

function sendCommand(x){
    socket.send(JSON.stringify(x));
}

function runScript() {
  var cmd = $("#scriptName").val();
  var cmdName = $("#scriptName option:selected").text();
  var dbName = $("input[name='dbName']:checked").val();
  running = true;
  console.log('Trying to execute cmd ' + cmdName);
  var socketUrl = socketProtocol + '//' + window.location.hostname + (window.location.port ? ':'+window.location.port: '') +'/run'
  console.log(socketUrl);
  socket = new WebSocket(socketUrl);

  socket.onopen = () => {
    //socket.send(cmd); 
      sendCommand({
                dbName: dbName,
                cmd: cmd
            });
  }

  socket.onmessage = e => {
    console.log('Message from server:', event.data);
    //$('#log').append(cmd + ':' + event.data.replace(/\r\n|\r|\n/g,"<br />"))
    //logAppend(cmdName + ':' + event.data)
    logAppend(event.data)
    logAppend("\n");
    logScroll();
  }
  
  socket.onclose = () => {
    console.log("WebSocket is closed now.");
    running=false;
    $("#scImage").attr("src","/images/Play1Normal.png");
    $("#scDiv").text("Execute script");
  }
  return socket;
}

function killScript(){
  running = false;
  sendCommand({cmd: 'kill'});
}
/*
function openSocket(cmd) {
  console.log('Trying to execute cmd ' + cmd);
  var socketUrl = socketProtocol + '//' + window.location.hostname + ':3000/' + cmd + '/'
  socket = new WebSocket(socketUrl);

  socket.onopen = () => {
    socket.send('Here\'s some text that the server is urgently awaiting!'); 
  }

  socket.onmessage = e => {
    console.log('Message from server:', event.data);
    logAppend(cmd + ':' + event.data)
    logAppend("\n");
    logScroll();
  }
  
  return socket;
}

function closeSocket(){
  if(!!socket) {
    if (socket.readyState === WebSocket.OPEN) {
      socket.close();
      console.log('websocket has been closed successfully.');
    }else{
      console.log('websocket readystate='+socket.readyState);
    }
  }else{
    console.log('websocket is not opened')
  };
}
*/