var ShishijiMap = /** @class */ (function () {
    function ShishijiMap(map_element, map_src, user_resizable) {
        this.map_id = this._uuid();
        user_resizable !== null && user_resizable !== void 0 ? user_resizable : (user_resizable = true);
        this.map_parent = map_element;
        this.src = map_src;
        this.resizable = user_resizable;
    }
    ShishijiMap.prototype.create = function () {
        var _this = this;
        this.map_parent.innerHTML = "<div class=\"shishijimap-large\" id=\"".concat(this.map_id, "\" style=\"width: 100%; height: 100%;\">\n            <img src=\"").concat(this.src, "\" id=\"").concat(this.map_id, "_img\">\n        </div>");
        this.map_large = document.getElementById(this.map_id);
        this.map_parent.addEventListener("touchstart", function (e) {
            onTouchDown(e, _this.map_large);
        });
        this.map_parent.addEventListener("touchmove", function (e) {
            onTouchMove(e, _this.map_large);
        });
        this.map_parent.addEventListener("touchend", function (e) {
            onTouchLeave(e, _this.map_large);
        });
        // '
        this.map_parent.addEventListener("wheel", function (e) {
            zoomByWheel(e, document.getElementById("".concat(_this.map_id, "_img")), _this.map_large);
        });
        var g = document.getElementById("".concat(_this.map_id, "_img"));
        if (g.clientHeight < this.map_large.clientHeight){
            g.style.height = this.map_large.clientHeight + "px";
        } else {
            g.style.width = this.map_large.clientWidth + "px";
        }
    };
    ShishijiMap.prototype._uuid = function () {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0;
            var v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    };
    return ShishijiMap;
}());
