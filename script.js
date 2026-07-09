document.querySelectorAll("a").forEach(link=>{

link.addEventListener("click",function(e){

if(this.hash){

e.preventDefault();

document.querySelector(this.hash)

.scrollIntoView({

behavior:"smooth"

});

}

});

});
