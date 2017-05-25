/*
 * fis
 * http://fis.baidu.com/
 */

'use strict';
module.exports = function (content, file, conf) {
    var options = file.jswrapperwithdeps;

    if (file.isMod || conf.wrapAll || options) {

        var template = getConfig('template', options, conf);
        var type = getConfig('type', options, conf);

        //扩展template能力，支持function
        if(typeof template === 'function'){
            var temp = template(file);
            if(temp){
                template = temp;
            }
        }
        // wrap
        if (template) {
            var deps = file.requires.concat([]);

            if (deps.length > 0) {
                deps = '[\'require\', \'exports\', \'module\',\'' + deps.join('\',\'') + '\']';
            } else {
                deps = '[\'require\', \'exports\', \'module\']';
            }

            content = String(template)
                .split('${content}').join(content)
                .split('${id}').join(file.getId())
                .split('${deps}').join(deps);

                //增加md5
        } else if (type === 'amd') {
            if (!/^\s*define\s*\(/.test(content)) {
                content = 'define(\'' + file.getId()+ '\', ' + deps + ', function(require, exports, module){ ' + content +
                    ' \r\n});';
            }
        } else {
            if (!/^\s*(?:[!(]\s*|void\s+)function\(/.test(content)) {
                content = '!function(){try{ ' + content + ' \r\n}catch(e){}}();';
            }
        }
    }
    return content;
};

function getConfig(key, local, global) {
    return local && typeof local[key] !== 'undefined' ? local[key] : global[key];
}
