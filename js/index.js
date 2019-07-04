$(document).ready(function () {
  //-----------------variables---------------------
  let globalHash;
  let globalParam;
  let funcClick;
  let globalrule;
  $('#svgDiv').height('400');
  let globalWidth = $('#svgDiv').width();
  let globalAmount = Math.trunc(globalWidth/135);
  globalAmount = globalAmount*8;
  $('#smallTableSize').html('(interactive method) Maximum size: '+globalAmount);
  //------------------events------------------------
  $(document).on("keyup", "#inputTableSize", function (e) {
    $(this).val(Mask($(this).val()));
  });

  $(document).on("keyup", "#inputSearchNode", function (e) {
    $(this).val(Mask($(this).val()));
  });

  $(document).on("keyup", "#nodeKeyInsert", function (e) {
    $(this).val(Mask($(this).val()));
  });

  $(document).on("keyup", "#nodeKeyDelete", function (e) {
    $(this).val(Mask($(this).val()));
  });

  $(document).on('click', '#buttonTableSize', function (e) {
    let tableSize = $('#inputTableSize').val();

    if (tableSize < 1) {
      alert('minimun size : 1');
      $('#inputTableSize').css('border-color', 'red');
    }else if(tableSize > globalAmount){
      $('#parameters').fadeOut('fast');
      $('#sizeTable').html("Size: "+tableSize);
      $('#exists').fadeOut('fast');
      $('#notExists').fadeOut('fast');
      $('#inserted').fadeOut('fast');
      $('#deleted').fadeOut('fast');
      $('#div_notInteractive').fadeIn('fast');
      $('#content').fadeIn('fast');
      $('#div_selectVelocity').fadeOut('fast');

      globalrule = 1;
      globalHash = new HashTable(tableSize);
      globalParam = {
        div:{
          id:'svgDiv'
        },
        svg:{
          id:'mySvg'
        },
        group:{
          id:'myGroup'
        }
      };
    }else{
      $('#parameters').fadeOut('fast');
      $('#content').fadeIn('fast');

      globalrule = 0;
      globalHash = new HashTable(tableSize, funcClick);
      globalParam = {
        div:{
          id:'svgDiv'
        },
        svg:{
          id:'mySvg'
        },
        group:{
          id:'myGroup'
        }
      };
      globalHash.startHash(globalParam);
    }
  });

  $(document).on('click', '#buttonModalInsertNode', function (e) {
    if (checkInsert()){
      let key = $('#nodeKeyInsert').val();
      let value = $('#nodeValueInsert').val();
      let velocity = $("#selectVelocity").val();
      velocity = parseInt(velocity, 10);
      key = parseInt(key, 10);

      let node = {key:key, value:value}
      let hist = globalHash.insertNode(node);

      $('#buttonAddNode').hide();
      $('#buttonDeleteNode').hide();
      $('#formSearchNode').hide();
      $('#selectVelocity').hide();
      $('#buttonOkInsert').fadeIn('fast');

	    if (hist == -1) {
        alert('The key '+key+' already exists!');
      }else if (hist == -2) {
        alert('Problem inserting key '+key+' (Size exceeded - infinite loop)!');
      }else if (hist != -1 && hist != null) {
        if (globalrule == 0) {
          globalParam.velocity = velocity;
          globalHash.updateTableInsert(hist, globalParam);
          drawParagraphsInsert(hist, node, 1);
        }else if(globalrule == 1){
          $('#inserted').html("inserted successfully");
          $('#inserted').fadeIn('fast');
        }

      }else{
        alert('Full table!');
      }
      console.log(globalHash);

      $('#nodeKeyInsert').val('');
      $('#nodeValueInsert').val('');
      $('#modalInsert').modal('hide');

    }
  });

  $(document).on('click', '#buttonOkInsert', function (e) {
    globalHash.completed(globalParam);
    $('#buttonOkInsert').hide();
    $('#notExists').hide();
    $('#exists').hide();
    $('#inserted').hide();
    $('#deleted').hide();
    $('#buttonAddNode').fadeIn('fast');
    $('#buttonDeleteNode').fadeIn('fast');
    $('#formSearchNode').fadeIn('fast');
    $('#selectVelocity').fadeIn('fast');
    $('#divParagraphs').remove();
  });

  $(document).on('submit', '#formSearchNode', function (e) {
    e.preventDefault();
    let velocity = $("#selectVelocity").val();
    velocity = parseInt(velocity, 10);

    let key = $('#inputSearchNode').val();
	  key = parseInt(key, 10);
    if (key) {
      $('#buttonOkInsert').fadeIn('fast');
      $('#buttonAddNode').hide();
      $('#buttonDeleteNode').hide();
      $('#formSearchNode').hide();
      $('#selectVelocity').hide();

      let hist = globalHash.findNode(key);
      if (globalrule == 0) {
        if (hist.length < 1) {
          alert('Key not found!');
        }else if (hist[hist.length-1] != -1) {
          alert('Found key!');
          globalParam.velocity = velocity;
          globalHash.updateTableSearch(hist, globalParam);
          $('#modalInfoKey').val(globalHash.hash_table[hist[hist.length-1]].key);
          $('#modalInfoValue').val(globalHash.hash_table[hist[hist.length-1]].value);
          $('#modalInfo').modal('show');

        }else{
          alert('Key not found!');
          globalParam.velocity = velocity;
          globalHash.updateTableSearch(hist, globalParam);
        }
        drawParagraphsInsert(hist, {key:key}, 2);
      }else if(globalrule == 1){
        if (hist.length < 1) {
          $('#notExists').html("Key "+key+" not found!");
          $('#notExists').fadeIn('fast');
        }else if (hist[hist.length-1] != -1) {
          $('#exists').html("Key "+key+" found!");
          $('#modalInfoKey').val(globalHash.hash_table[hist[hist.length-1]].key);
          $('#modalInfoValue').val(globalHash.hash_table[hist[hist.length-1]].value);
          $('#modalInfo').modal('show');
          $('#exists').fadeIn('slow');

        }else{
          $('#notExists').html("Key "+key+" not found!");
          $('#notExists').fadeIn('fast');
        }
      }

      $('#inputSearchNode').val('');
    }else{
      alert('Enter the key!');
    }

  });

  $(document).on('click', '#btn_insertMany', function (e) {
    if (checkInsertMany()) {
      let nodes = $('#input_insertMany').val();

      nodes = "["+nodes+"]";
      if (JSON.parse(nodes)) {
        let obj = JSON.parse(nodes);
        for (var i = 0; i < obj.length; i++) {
          let node = {key:obj[i].key, value:obj[i].value}
          let hist = globalHash.insertNode(node);

          if (hist == -1) {
            alert('The key '+obj[i].key+' already exists!');
          }else if (hist == -2) {
            alert('Problem inserting key '+obj[i].key+' (Size exceeded - infinite loop)!');
          }else if (hist == -1 || hist == null) {
            alert('Full table!');
          }
        }
        $('#input_insertMany').val('');
        $('#inserted').html("inserted successfully");
        $('#inserted').fadeIn('fast');
        setTimeout(function(){ $('#inserted').fadeOut('slow'); }, 1000);
      }else{
        alert('Invalid JSON value!');
      }

      console.log(globalHash);

    }
  });

  $(document).on('click', '#buttonModalDeleteNode', function (e) {
    if (checkDelete()){
      let key = $('#nodeKeyDelete').val();
	    key = parseInt(key, 10);
      let velocity = $("#selectVelocity").val();
      velocity = parseInt(velocity, 10);
      let rule = 1;//$("input[name='radioDelete']:checked").val();
      $('#buttonAddNode').hide();
      $('#buttonDeleteNode').hide();
      $('#formSearchNode').hide();
      $('#selectVelocity').hide();
      $('#buttonOkInsert').fadeIn('fast');
      if (globalrule == 0) {
        if (rule == 0) {
          let hist = globalHash.deleteNode_InsertDelete(key);
          globalParam.velocity = velocity;
          globalHash.updateTableInsert(hist, globalParam, 'delete');
          if (hist.length < 1) {
            alert('Key not found!');
          }else if (hist[hist.length-1] == -1) {
            alert('Key not found!');
          }
          drawParagraphsInsert(hist, {key:key}, 0);
        }else if (rule == 1) {
          globalParam.velocity = velocity;
          let hist = globalHash.deleteNode_Available(key);
          globalHash.updateTableInsert(hist, globalParam, 'delete');
          if (hist.length < 1) {
            alert('Key not found!');
          }else if (hist[hist.length-1] == -1) {
            alert('Key not found!');
          }
          drawParagraphsInsert(hist, {key:key}, 0);
        }
        console.log(globalHash);
      }else if (globalrule == 1) {
        if (rule == 0) {
          let hist = globalHash.deleteNode_InsertDelete(key);
          if (hist.length < 1) {
            alert('Key not found!');
          }else if (hist[hist.length-1] == -1) {
            alert('Key not found!');
          }
          drawParagraphsInsert(hist, {key:key}, 0);
        }else if (rule == 1) {
          let hist = globalHash.deleteNode_Available(key);
          if (hist.length < 1) {
            alert('Key not found!');
          }else if (hist[hist.length-1] == -1) {
            alert('Key not found!');
          }
          drawParagraphsInsert(hist, {key:key}, 0);
        }
        console.log(globalHash);
        $('#deleted').html("deleted successfully");
        $('#deleted').fadeIn('fast');

      }

      $('#nodeKeyDelete').val('');
      $('#modalDelete').modal('hide');
    }
  });

  $(document).on('click', '#buttonCompact', function (e) {
    globalHash.compact();
    if (globalrule == 0) {
      $('#buttonAddNode').hide();
      // $('#buttonCompact').hide();
      $('#buttonDeleteNode').hide();
      $('#formSearchNode').hide();
      $('#selectVelocity').hide();
      $('#buttonOkInsert').fadeIn('fast');

      globalHash.updateTable(globalParam);
      // globalHash.completed(globalParam);
    }
  });
  //---------------------functions------------------

  function Mask(text) {
    return text.replace(/[^0-9,;]/gi,"");
  }

  function checkInsert() {
    if ($('#nodeKeyInsert').val()=='') {
      alert('Required Key');
      return false;
    }
    return true;
  }

  function checkInsertMany() {
    if ($('#input_insertMany').val()=='') {
      alert('Complete the field with valid values');
      return false;
    }
    return true;
  }

  function checkDelete() {
    if ($('#nodeKeyDelete').val()=='') {
      alert('Complete all fields');
      return false;
    }
    return true;
  }

  function drawParagraphsInsert(hist, node, type) {
    $("#paragraphs").html('');
    $("#svgDiv").append('<div class="container-fluid" id="divParagraphs"><div id="paragraphs"></div></div>');
    $("#paragraphs").append('<hr>');


    let h1 = node.key%globalHash.hash_table_size;
    let h2 = globalHash.prime-(node.key%globalHash.prime);
    let stringH1 = node.key+" % "+globalHash.hash_table_size;
    let stringH2 = globalHash.prime+" - ("+node.key+" % "+globalHash.prime+")";

    for (var i = 0; i < hist.length; i++) {
      if (type == 1) {
        if (i != hist.length-1 && i==0) {
          $("#paragraphs").append("<p class='alert alert-danger' > H(k) = "+stringH1+" = "+hist[i]+" -- Collision detected, Calculate H'(k)  -->  H'(k) = "+
          stringH2+" = "+h2+"</p>");
        }else if(i != hist.length-1 && i!=0){
          $("#paragraphs").append("<p class='alert alert-danger' >( H(k) + i * H'(k) ) % size = ("+h1+" + "+i+" * "+h2+") % "+globalHash.hash_table_size+" = "
          +hist[i]+" - Collision detected, Next jump</p>");
        }else if (i==hist.length-1 && hist.length > 1){
          $("#paragraphs").append("<p class='alert alert-success' >( H(k) + i * H'(k) ) % size = ("+h1+" + "+i+" * "+h2+") % "+globalHash.hash_table_size+" = "
          +hist[i]+" -- No collision detected, Insert node</p>");
        }else{
          $("#paragraphs").append("<p class='alert alert-success' >H(k) = "+stringH1+" = "+hist[i]+" -- No collision detected, Insert node</p>");
        }
      }else if (type == 0) {
        if (hist[hist.length-1] == -1) {
          if (i != hist.length-2 && i==0) {
            $("#paragraphs").append("<p class='alert alert-danger' > H(k) = "+stringH1+" = "+hist[i]+" -- Collision detected, Calculate H'(k)  -->  H'(k) = "+
            stringH2+" = "+h2+"</p>");
          }else if(i != hist.length-2 && i!=0 && i!=hist.length-1){
            $("#paragraphs").append("<p class='alert alert-danger' >( H(k) + i * H'(k) ) % size = ("+h1+" + "+i+" * "+h2+") % "+globalHash.hash_table_size+" = "
            +hist[i]+" - Collision detected, Next jump</p>");
          }else if (i==hist.length-2 && hist.length > 1 && i!=hist.length-1){
            $("#paragraphs").append("<p class='alert alert-success' >( H(k) + i * H'(k) ) % size = ("+h1+" + "+i+" * "+h2+") % "+globalHash.hash_table_size+" = "
            +hist[i]+" -- No collision detected, Not found</p>");
          }
          // else{
          //   $("#paragraphs").append("<p class='alert alert-success' >H(k) = "+stringH1+" = "+hist[i]+" -- No collision detected, Delete node</p>");
          // }
        }else{
          if (i != hist.length-1 && i==0) {
            $("#paragraphs").append("<p class='alert alert-danger' > H(k) = "+stringH1+" = "+hist[i]+" -- Collision detected, Calculate H'(k)  -->  H'(k) = "+
            stringH2+" = "+h2+"</p>");
          }else if(i != hist.length-1 && i!=0){
            $("#paragraphs").append("<p class='alert alert-danger' >( H(k) + i * H'(k) ) % size = ("+h1+" + "+i+" * "+h2+") % "+globalHash.hash_table_size+" = "
            +hist[i]+" - Collision detected, Next jump</p>");
          }else if (i==hist.length-1 && hist.length > 1){
            $("#paragraphs").append("<p class='alert alert-success' >( H(k) + i * H'(k) ) % size = ("+h1+" + "+i+" * "+h2+") % "+globalHash.hash_table_size+" = "
            +hist[i]+" -- Found, Deleted</p>");
          }else{
            $("#paragraphs").append("<p class='alert alert-success' >H(k) = "+stringH1+" = "+hist[i]+" -- Found, Delete node</p>");
          }
        }
      }else if(type == 2){
        if (hist[hist.length-1] == -1) {
          if (i != hist.length-2 && i==0) {
            $("#paragraphs").append("<p class='alert alert-danger' > H(k) = "+stringH1+" = "+hist[i]+" -- Collision detected, Calculate H'(k)  -->  H'(k) = "+
            stringH2+" = "+h2+"</p>");
          }else if(i != hist.length-2 && i!=0 && i!=hist.length-1){
            $("#paragraphs").append("<p class='alert alert-danger' >( H(k) + i * H'(k) ) % size = ("+h1+" + "+i+" * "+h2+") % "+globalHash.hash_table_size+" = "
            +hist[i]+" - Collision detected, Next jump</p>");
          }else if (i==hist.length-2 && hist.length > 1 && i!=hist.length-1){
            $("#paragraphs").append("<p class='alert alert-success' >( H(k) + i * H'(k) ) % size = ("+h1+" + "+i+" * "+h2+") % "+globalHash.hash_table_size+" = "
            +hist[i]+" -- Not found</p>");
          }
          // else{
          //   $("#paragraphs").append("<p class='alert alert-success' >H(k) = "+stringH1+" = "+hist[i]+" -- No collision detected, Delete node</p>");
          // }
        }else{
          if (i != hist.length-1 && i==0) {
            $("#paragraphs").append("<p class='alert alert-danger' > H(k) = "+stringH1+" = "+hist[i]+" -- Collision detected, Calculate H'(k)  -->  H'(k) = "+
            stringH2+" = "+h2+"</p>");
          }else if(i != hist.length-1 && i!=0){
            $("#paragraphs").append("<p class='alert alert-danger' >( H(k) + i * H'(k) ) % size = ("+h1+" + "+i+" * "+h2+") % "+globalHash.hash_table_size+" = "
            +hist[i]+" - Collision detected, Next jump</p>");
          }else if (i==hist.length-1 && hist.length > 1){
            $("#paragraphs").append("<p class='alert alert-success' >( H(k) + i * H'(k) ) % size = ("+h1+" + "+i+" * "+h2+") % "+globalHash.hash_table_size+" = "
            +hist[i]+" -- Found</p>");
          }
        }
      }
      // if (i != hist.length-1 && i==0) {
      //   $("#paragraphs").append("<p class='alert alert-danger' > H(k) = "+stringH1+" = "+hist[i]+" -- Collision detected, Calculate H'(k)  -->  H'(k) = "+
      //   stringH2+" = "+h2+"</p>");
      // }else if(i != hist.length-1 && i!=0){
      //   $("#paragraphs").append("<p class='alert alert-danger' >( H(k) + i * H'(k) ) % size = ("+h1+" + "+i+" * "+h2+") % "+globalHash.hash_table_size+" = "
      //   +hist[i]+" - Collision detected, Next jump</p>");
      // }else if (i==hist.length-1 && hist.length > 1){
      //   let typeAux = type == 0 ? "No collision detected, Delete node" : "No collision detected, Insert node";
      //   $("#paragraphs").append("<p class='alert alert-success' >( H(k) + i * H'(k) ) % size = ("+h1+" + "+i+" * "+h2+") % "+globalHash.hash_table_size+" = "
      //   +hist[i]+" -- "+typeAux+"</p>");
      // }else{
      //   let typeAux = type == 0 ? "No collision detected, Delete node" : "No collision detected, Insert node";
      //   $("#paragraphs").append("<p class='alert alert-success' >H(k) = "+stringH1+" = "+hist[i]+" -- "+typeAux+"</p>");
      // }
    }
  }

  funcClick = function click(node) {
    if (node.key) {
      $('#modalInfoKey').val(node.key);
      $('#modalInfoValue').val(node.value);
      $('#modalInfo').modal('show');
    }
  }
  //------------------call-------------------------




});
