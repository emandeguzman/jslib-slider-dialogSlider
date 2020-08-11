/*
 *requires:
 *  utils/uuidv4
 */

function dialogSlider(el_list){
    // add required html elements
    const uuid = "_" + uuidv4();

    const template = document.createElement("template");
    template.innerHTML =    `<div id="${uuid}" class="dialog_slider">
                                <div class="viewport">
                                    <div class="slide">
                                        <div class="img_container left"  ><img/></div>
                                        <div class="img_container center"><img/></div>
                                        <div class="img_container right" ><img/></div>
                                    </div>
                                    <div class="slide_left_btn" ><a href="#"><div></div><div></div><div></div><div></div></a></div>
                                    <div class="slide_right_btn"><a href="#"><div></div><div></div><div></div><div></div></a></div>
                                </div>
                            </div>`

    const root = template.content.firstChild;
    root.style.display="none";
    document.body.appendChild(root);


    // functions
    function slideshow(index){
        const animation_duration = 400;
        let animating = false;
        let cur_index = index;

        startKeypressListener();

        function setSlideImages(index) {
            const img_left   = document.querySelector(`#${uuid} .slide .left img`);
            const img_center = document.querySelector(`#${uuid} .slide .center img`);
            const img_right  = document.querySelector(`#${uuid} .slide .right img`);

            img_center.src = el_list[index].getAttribute("data-imgurl");

            if (index == 0) {
                img_left.src = el_list[el_list.length - 1].getAttribute("data-imgurl");
            }
            else {
                img_left.src = el_list[index - 1].getAttribute("data-imgurl");
            }

            if (index == el_list.length - 1) {
                img_right.src = el_list[0].getAttribute("data-imgurl");
            }
            else {
                img_right.src = el_list[index + 1].getAttribute("data-imgurl");
            }
        }

        //show slideshow elements
        root.style.display = "";
        setSlideImages(cur_index);
        
        //slide left
        document.querySelector(`#${uuid} .slide_left_btn a`).addEventListener("click", event=>{
            event.preventDefault();
            if (animating) return;

            animating = true;

            const slide = document.querySelector(`#${uuid} .slide`);
            const start = performance.now();

            requestAnimationFrame(
                function animate(time){
                    let timefraction = (time - start) / animation_duration;

                    slide.style.left = ((100 * timefraction) * -1) - 100 + '%';

                    if (timefraction < 1) {
                        requestAnimationFrame(animate);
                        return;
                    }

                    cur_index = (()=>{
                        if (cur_index == el_list.length - 1) return 0;
                        else return cur_index + 1;
                    })();
                    setSlideImages(cur_index);
                    slide.style.left = "";
                    animating = false;
                }
            );

        })

        //slide right
        document.querySelector(`#${uuid} .slide_right_btn a`).addEventListener("click", event=>{
            event.preventDefault();

            if (animating) return;
            
            animating = true;

            const slide = document.querySelector(`#${uuid} .slide`);
            const start = performance.now();
            requestAnimationFrame(
                function animate(time){
                    let timefraction = (time - start) / animation_duration;

                    slide.style.left = ((100 - (100 * timefraction)) * -1) + '%';

                    if (timefraction < 1) {
                        requestAnimationFrame(animate);
                        return;
                    }


                    // img_left.src   = "img/gallery1/full/1.jpg";
                    // img_center.src = "img/gallery1/full/2.jpg";
                    // img_right.src  = "img/gallery1/full/3.jpg";
                    cur_index = (()=>{
                        if (cur_index == 0) return el_list.length - 1;
                        else return cur_index - 1;
                    })();
                    setSlideImages(cur_index);
                    slide.style.left = "";
                    animating = false;
                }
            );

        })
    }

    //stop slideshow - start
    function stopSlideshow() {
        document.querySelector(`#${uuid}`).style.display="none";
    }

    // using escape key
    function keypressListener(event) {
        if (event.key == 'Escape') {
            stopSlideshow();
            stopKeypressListener();
        }
    }

    function startKeypressListener() {
        document.body.addEventListener("keydown", keypressListener);
    }

    function stopKeypressListener() {
        document.body.removeEventListener("keydown", keypressListener);
    }

    // clickon on the background
    document.querySelector(`#${uuid}`).addEventListener("click", event=>{
        event.preventDefault();
        if (event.target == document.querySelector(`#${uuid}`)) {
            stopSlideshow();
        }
    })
    //stop slideshow - end



    // add click event listener to all images to start slideshow
    for (let i = 0; i < el_list.length; i++) {
        el_list[i].addEventListener(
            "click",
            event=>{
                event.preventDefault();
                slideshow(i);
            }
        )
    }

}
