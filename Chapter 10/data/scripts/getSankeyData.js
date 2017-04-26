"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var d3 = require("d3");
var _ = require("lodash");
var path_1 = require("path");
var fs_1 = require("fs");
function generateData() {
    return __awaiter(this, void 0, void 0, function () {
        var parser, csv2010, data2010, seats2010, csv2015, data2015, seats2015, merged, nodes, links;
        return __generator(this, function (_a) {
            parser = d3.dsvFormat(';');
            csv2010 = fs_1.readFileSync('../electdata_2010.csv', { encoding: 'utf8' });
            data2010 = parser.parse(csv2010);
            data2010.forEach(function (d) {
                delete d.Region;
                delete d.Electorate;
                delete d.MP;
                delete d['County Area'];
            });
            seats2010 = data2010.map(function (d) {
                var seat = d.Name;
                delete d.Name;
                var max = Math.max.apply(null, Object.keys(d).map(function (x) { return d[x]; }));
                var winner = Object.keys(d).filter(function (x) { return Number(d[x]) === max; }).shift();
                return {
                    seat: seat,
                    winner2010: winner,
                };
            });
            csv2015 = fs_1.readFileSync('../electdata_2015.csv', { encoding: 'utf8' });
            data2015 = parser.parse(csv2015);
            data2015.forEach(function (d) {
                delete d.Region;
                delete d.Electorate;
                delete d.MP;
                delete d['County Area'];
            });
            seats2015 = data2015.map(function (d) {
                var seat = d.Name;
                delete d.Name;
                var max = Math.max.apply(null, Object.keys(d).map(function (x) { return d[x]; }));
                var winner = Object.keys(d).filter(function (x) { return Number(d[x]) === max; }).shift();
                return {
                    seat: seat,
                    winner2015: winner,
                };
            });
            merged = _.merge([], seats2015, seats2010);
            nodes = [
                { name: "CON2015" },
                { name: "LAB2015" },
                { name: "LIB2015" },
                { name: "UKIP2015" },
                { name: "Green2015" },
                { name: "NAT2015" },
                { name: "MIN2015" },
                { name: "OTH2015" },
                { name: "CON2010" },
                { name: "LAB2010" },
                { name: "LIB2010" },
                { name: "UKIP2010" },
                { name: "Green2010" },
                { name: "NAT2010" },
                { name: "MIN2010" },
                { name: "OTH2010" }
            ];
            links = merged.reduce(function (coll, curr) {
                var source = _.findIndex(nodes, function (d) { return d.name === curr.winner2010 + '2010'; });
                var target = _.findIndex(nodes, function (d) { return d.name === curr.winner2015 + '2015'; });
                var linkIdx = _.findIndex(coll, function (d) { return d.source === source && d.target === target; });
                if (linkIdx === -1) {
                    coll.push({
                        source: source,
                        target: target,
                        value: 1,
                    });
                }
                else {
                    coll[linkIdx].value++;
                }
                return coll;
            }, []);
            fs_1.writeFileSync(path_1.resolve(__dirname, '..', 'uk-election-sankey.json'), JSON.stringify({ nodes: nodes, links: links }, null, '\t'), { encoding: 'utf8' });
            return [2 /*return*/];
        });
    });
}
generateData();
