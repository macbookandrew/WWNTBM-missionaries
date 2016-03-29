jQuery(document).ready(function(){

    jQuery('input[name="post_title"]').on('change',function(){
        var postTitle = jQuery('input[name="post_title"]').val(),
            missionaryKey = postTitle.replace(/([\w]+)\s.+\s([\w]+)/gi, '$2-$1').toLowerCase();
        jQuery('#acf-field-missionary_key').val(missionaryKey);
    });

});
