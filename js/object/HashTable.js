function HashTable(size, click) {
  this.hash_table_size  = parseInt(size,10);
  this.current_size = 0;
  this.hash_table = [];
  this.prime = mediumValidPrimeNumber(this);
  for (var i = 0; i < size; i++) {
    this.hash_table[i] = -1;
  }
  this.click = click;
  this.input=[];
  this.output=[];
  console.log(this);
}

function mediumValidPrimeNumber(table){
  if(table.hash_table_size <= 3){return 1;}
  for (let i = Math.trunc(table.hash_table_size/2); i < table.hash_table_size; i++) {
    if (isPrimeNumber(i)) {
      return i;
    }
  }
  return 3;
}

function isPrimeNumber(number){
  if (number == 2) {
    return false;
  }
  for (let i = 2; i < number; i++) {
    if (number % i == 0) {
      return false;
    }
  }
  return true;
}

$(document).ready(function () {
  HashTable.prototype.getHashTable = function(){
    return this.hash_table;
  };

  HashTable.prototype.insertNode = function(node){
    if (isFull(this)) {
      return null;
    }
    var copia = $.extend(true, {}, node);
    this.input.push(copia);
    let index = hash1(this, node.key);
    let index2 = hash2(this, node.key);
    let newIndex=0;
    let size = this.hash_table_size;
    let historic = [];


    if(!checkForExistence(node.key, this)){
      if (this.hash_table[index] != -1 && this.hash_table[index] != "A") {//collision
        let cont = 1;
        historic.push(index);

        while (true && cont <= this.hash_table_size) {

          newIndex = ((index + (cont*index2)) % size);
          historic.push(newIndex);

          if (this.hash_table[newIndex] && !this.hash_table[newIndex].key) {
            this.hash_table[newIndex] = node;
            this.current_size++;
            return historic;
          }
          cont+=1;
        }
        return -2;
      } else {//no collision
        historic.push(index);
        this.hash_table[index] = node;
        this.current_size++;
        return historic;
      }
    }else{
      return -1;
    }

  };

  HashTable.prototype.findNode = function(key){
    let index = hash1(this, key);
    let index2 = hash2(this, key);
    let newIndex=0;
    let size = this.hash_table_size;
    let historic = [index, -1];

    if (this.hash_table[index] != -1) {
      historic =[];
      let cont = 1;
      historic.push(index);
      if (this.hash_table[index].key && this.hash_table[index].key == key) {
        return historic;
      }

      while (true && cont <= this.hash_table_size) {
        newIndex = ((index + (cont*index2)) % size);
        historic.push(newIndex);
        if (this.hash_table[newIndex] && this.hash_table[newIndex].key && this.hash_table[newIndex].key == key) {
          return historic;
        }else if(this.hash_table[newIndex] && !this.hash_table[newIndex].key && this.hash_table[newIndex] == -1){
          historic.push(-1);
          return historic;
        }
        cont+=1;
      }
      historic = [-1];
      return historic;
    } else {
      return historic;
    }
  }

  HashTable.prototype.deleteNode_InsertDelete = function(key){
    let aux = [];
    let copy;
    let hist = this.findNode(key);
    if (hist[hist.length-1] != -1) {
      this.hash_table[hist[hist.length-1]] = -1;
      copy = this.hash_table.slice(0);
      copy2 = this.input.slice(0);console.log(copy2);
      // for (var i = 0; i < copy.length; i++) {
      //   if (copy[i] != -1 && copy[i] != "A") {
      //     aux.unshift(copy[i]);
      //   }
      // }
      let cont;
      for (var i = 0; i < copy2.length; i++) {
        if (copy2[i].key == key) {
          cont = i;
        }
      }
      copy2.splice(cont, 1);

      for (var i = 0; i < this.hash_table_size; i++) {
        if (this.hash_table[i] != -1 && this.hash_table[i] != "A") {
          this.hash_table[i] = -1;
        }
      }
      this.current_size = 0;
      this.input=[];
      for (var i = 0; i < copy2.length; i++) {
        this.insertNode({key:copy2[i].key, value:copy2[i].value});
      }
      // for (var i = 0; i < aux.length; i++) {
      //   this.insertNode({key:aux[i].key, value:aux[i].value});
      // }
    }
    return hist;
  }
  HashTable.prototype.deleteNode_Available  = function(key){
    let aux = [];
    let hist = this.findNode(key);
    if (hist[hist.length-1] != -1) {
      this.hash_table[hist[hist.length-1]] = "A";
      this.current_size --;
    }
    this.output.push(key);
    return hist;
  }
  HashTable.prototype.compact  = function(){
    for (var i = 0; i < this.hash_table_size; i++) {
      this.hash_table[i] = -1;
    }

    for (var i = 0; i < this.input.length; i++) {
      if (checkOutput(this.input[i].key, this.output)) {
        this.input.splice(i,1);
      }
    }
    var copy = this.input.slice(0);//$.extend(true, {}, this.input);
    this.input = [];
    this.output = [];
    this.current_size = 0;
    for (var i = 0; i < copy.length; i++) {
      this.insertNode(copy[i]);
    }
  }
  function checkOutput(key, output) {
    for (var i = 0; i < output.length; i++) {
      if (output[i] == key) {
        return true;
      }
    }
    return false;
  }
  HashTable.prototype.updateTable = function (hashParam){
    let g = d3.select("#"+hashParam.svg.id).select("#"+hashParam.group.id);

    g.selectAll("rect").data(this.hash_table)
    .attr("fill", function (d,i) {
      if (d.key) {
        return "#e6e9ec";
      }else{
        return "white";
      }
    })
    .attr("stroke", function (d,i) {
      if (d.key) {
        return "#343a40";
      }else{
        return "#007bff";
      }
    });

    g.selectAll('.text').data(this.hash_table)
    .text(function(d) { return d.key ? d.key : d; })
    .attr("fill", function (d,i) {
      return "black";
    });
  }
  HashTable.prototype.startHash = function (hashParam) {
    let width = $("#"+hashParam.div.id).width();
    let height = $("#"+hashParam.div.id).height();
    let space_y = 50;
    let space_x = 15;
    let size = 8;

    let svg = d3.select("#"+hashParam.div.id).append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", hashParam.svg.id)
    .append("g")
    .attr("id", hashParam.group.id);

    let g = d3.select("#"+hashParam.svg.id).select("#"+hashParam.group.id);

    let gs = g.selectAll(".object")
    .data(this.hash_table)
    .enter().append("g")
    .attr("class", "object")
    .attr("cursor", "pointer")
    .attr("transform", function(d, i) {
      let x,y;
      let pos = Math.trunc(i/size);
      x = space_x+(2*pos*space_y)+((2*pos-0.5)*space_x);
      y = (i-pos*size)*space_y;

      return "translate(" + [x, y] + ")scale(1)";
    });

    gs.append("rect")
    .attr("class", "node")
    .attr("width", function (d,i) {
      return 2*space_y;
    })
    .attr("height", function (d,i) {
      return space_y-5;
    })
    .attr("fill", "white")
    .attr("stroke-width", 1)
    .attr("stroke", "#007bff")
    .attr("transform", function(d, i){
      return 'scale(0)';
    })
    .transition()
    .duration(1000)
    .attr("transform", function(d, i){
      return 'scale(1)';
    });

    gs.append("text")
    .attr("class", "text")
    .attr("dx", function (d,i) {
      return (space_y-5);
    })
    .attr("dy", function (d,i) {
      return (space_y)/2;
    })
    .text(function(d) { return " "; })
    .attr("text-anchor", "middle")
    .transition()
    .delay(1200)
    .text(function(d) { return d.key ? d.key : d; });

    gs.append("text")
    .attr("class", "count")
    .attr("dx", function (d,i) {
      return (space_y+(space_y+space_x));
    })
    .attr("dy", function (d,i) {
      return (space_y)/2;
    })
    .text(function(d) { return " "; })
    .attr("text-anchor", "middle")
    .attr("font-weight", "bold")
    .attr('fill', '#007bff')
    .transition()
    .delay(1200)
    .text(function(d, i) { return i; });

  }

  HashTable.prototype.updateTableInsert = function (historic, hashParam, rule) {
    let space_y = 50;
    let space_x = 15;
    let g = d3.select("#"+hashParam.svg.id).select("#"+hashParam.group.id);

    let rect = g.selectAll('rect').data(this.hash_table)
    .transition()
    .delay(function (d,i) {
      for (var j = 0; j < historic.length; j++) {
        if (i == historic[historic.length-1]) {
          return (historic.length-1)*hashParam.velocity;
        }else if (i == historic[j]) {
          return j*hashParam.velocity;
        }
      }
      return 0;
    })
    .attr("fill", function (d,i) {
      for (var j = 0; j < historic.length; j++) {
        if (i == historic[historic.length-1]) {
          return "green";
        }else if (i == historic[j]) {
          return "red";
        }
      }
      return "white";
    });

    let text = g.selectAll('.text').data(this.hash_table)
    .attr("dx", function (d,i) {
      return (space_y-5);
    })
    .attr("dy", function (d,i) {
      return (space_y)/2;
    })
    .attr("text-anchor", "middle")
    .attr("fill-opacity", 0)
    .text(function(d) { return d.key ? d.key : d; })
    .attr("font-weight", function (d,i) {
      if (i == historic[historic.length-1] || d.key) {
        if (typeof rule === 'undefined') {
          return "bold";
        }
        return "normal";
      }
    })
    .attr("fill", function (d,i) {
      for (var j = 0; j < historic.length; j++) {
        if (i == historic[historic.length-1]) {
          return "white";
        }else if (i == historic[j]) {
          return "white";
        }
      }
    });

    text.transition()
    .delay(function (d,i) {
      if (i == historic[historic.length-1]) {
        return (historic.length-1)*hashParam.velocity+(hashParam.velocity+0.2);
      }
      return 0;
    })
    .attr("fill-opacity", 1);

    click(hashParam, this);
  };

  HashTable.prototype.updateTableSearch = function (historic, hashParam) {
    let space_y = 50;
    let space_x = 10;
    let found = historic[historic.length-1] != -1 ? true : false;
    let aux = historic.slice(0);
    !found ? aux.splice(aux.length-1, 1) : aux;

    let g = d3.select("#"+hashParam.svg.id).select("#"+hashParam.group.id);

    let rect = g.selectAll('rect').data(this.hash_table)
    .transition()
    .delay(function (d,i) {
      for (var j = 0; j < historic.length; j++) {
        if (i == historic[historic.length-1]) {
          return (historic.length-1)*hashParam.velocity;
        }else if (i == historic[j]) {
          return j*hashParam.velocity;
        }
      }
      return 0;
    })
    .attr("fill", function (d,i) {
      for (var j = 0; j < historic.length; j++) {
        if (found && i == historic[historic.length-1] ) {
          return "green";
        }else if (!found && i == historic[historic.length-1]){
          return "red";
        }else if (i == historic[j]) {
          return "#007bff";
        }
      }
      return "white";
    });

    let text = g.selectAll('.text').data(this.hash_table)
    .attr("fill-opacity", 0)
    .attr("font-weight", function (d,i) {
      if (d.key) {
        return "bold";
      }
    })
    .attr("fill", function (d,i) {
      if (i == historic[historic.length-1]  && d.key) {
        return "white";
      }
    });

    text.transition()
    .delay(function (d,i) {
      if (i == historic[historic.length-1]) {
        return (historic.length-1)*hashParam.velocity+(hashParam.velocity+0.2);
      }
      return 0;
    })
    .attr("fill-opacity", 1);

    click(hashParam, this);
  };

  HashTable.prototype.completed = function (hashParam){
    let g = d3.select("#"+hashParam.svg.id).select("#"+hashParam.group.id);

    g.data(this.hash_table).selectAll("rect")
    .attr("fill", function (d,i) {
      if (!d.key) {
        return "white";
      }else{
        return "#e6e9ec";
      }
    })
    .attr("stroke", function (d,i) {
      if (d.key) {
        return "#343a40";
      }else{
        return "#007bff";
      }
    });

    g.data(this.hash_table).selectAll(".text")
    .attr("fill", function (d,i) {
      return "black";
    });
  };
  // -------------------functions-----------------
  function click(hashParam, hash) {
    d3.select("#"+hashParam.svg.id).select("#"+hashParam.group.id).selectAll('g')
    .on('click', function (d, i) {
      return hash.click(hash.hash_table[i]);
    });
  }

  function checkForExistence(key, tableHash) {

    let index = hash1(tableHash, key);
    let index2 = hash2(tableHash, key);
    let newIndex=0;
    let size = tableHash.hash_table_size;

    if (tableHash.hash_table[index] != -1) {
      let cont = 1;
      if (tableHash.hash_table[index] != -1 && tableHash.hash_table[index] != "A" && tableHash.hash_table[index].key && tableHash.hash_table[index].key == key) {
        return true;
      }

      while (true && cont <= tableHash.hash_table_size) {
        newIndex = ((index + (cont*index2)) % size);
        if (tableHash.hash_table[newIndex] && tableHash.hash_table[newIndex].key && tableHash.hash_table[newIndex].key == key) {
          return true;
        }else if(tableHash.hash_table[newIndex] && !tableHash.hash_table[newIndex].key && tableHash.hash_table[newIndex] == -1){
          return false;
        }
        cont+=1;
      }
      return false;
    } else {
      return false;
    }
  }

  function hash1(table, key){
    return key % table.hash_table_size;
  }

  function hash2(table, key){
    return table.prime - (key % table.prime);
  }

  function isFull(table){
    return table.current_size == table.hash_table_size;
  }

});
