

function isEmpty(obj,type){
    if( obj // 👈 null and undefined check
    && Object.keys(obj).length === 0
    && Object.getPrototypeOf(obj) === Object.prototype){
        console.log(`No ${type} present`);
        return true;
    }
    return false;
}


module.exports = {
    isEmpty
}
