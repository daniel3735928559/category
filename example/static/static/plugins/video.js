class VideoPlugin {
    constructor(){
	Vue.component('video-plugin', {
	    template: `<video controls>
  <source :src="url" :type="ending" />
  If you are seing this text, your browser does not support the video tag.
</video>`,
	    props: ['url','type'],
	});

    }
    run(comp, node, root){
	if(!root) return;
	console.log("LINK",node);
        var container = document.createElement("span");

	// Parse the link info
	var url = root.innerHTML.trim();
	var ending = 'video/'+url.substring(url.lastIndexOf(".")+1);

	// Insert the container
        root.parentNode.insertBefore(container, root);
	
	// Insert the component
	new comp.$options.components['video-plugin']({
	    el: container,
	    parent: comp,
	    propsData:{
		url:url,
		type:ending
	    }
	});
    }
}
