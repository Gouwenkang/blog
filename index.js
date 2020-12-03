function Func(v){
    console.log(v);
}


Function.prototype.before = function(cb){
    var self = this
    return function(){
        cb.apply(self,arguments)
        self.apply(self,arguments)
    }
}

Function.prototype.after = function(cb){
    let self = this
    return function(){
        const result = self.apply(self,arguments)
        cb.apply(self,arguments)
    }
}

Func.before(()=>{
    console.log('--------------------');
}).after(()=>{
    console.log('++++++++++++++++++++');
})(123)
