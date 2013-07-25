'use strict';

var qs = require('querystring');
var _ = require('lodash');

module.exports = Pager;

/**
 * @constructor
 * @param {Pager.Options} [options]
 */
function Pager(options)
{
  /*jshint maxstatements:999*/

  /**
   * @readonly
   * @type {Pager.Options}
   */
  this.options = _.extend({}, Pager.Options, Pager.RenderOptions, options);
  this.options.query = _.clone(this.options.query);

  /**
   * @readonly
   * @type {number}
   */
  this.page = this.options.page === -1
    ? parseInt(this.options.query[this.options.pageParam], 10)
    : this.options.page;

  if (isNaN(this.page) || this.page < 1)
  {
    this.page = 1;
  }

  /**
   * @readonly
   * @type {number}
   */
  this.limit = this.options.limit === -1
    ? parseInt(this.options.query[this.options.limitParam], 10)
    : this.options.limit;

  if (isNaN(this.limit) || this.limit < 1)
  {
    this.limit = this.options.defaultLimit;
  }

  /**
   * @readonly
   * @type {number}
   */
  this.skip = (this.page - 1) * this.limit;

  /**
   * @readonly
   * @type {number}
   */
  this.pageCount = 0;

  /**
   * @readonly
   * @type {number}
   */
  this.totalCount = 0;
}

/**
 * @type {object}
 * @extends {Pager.RenderOptions}
 */
Pager.Options = {
  /**
   * @type {string}
   */
  pageParam: 'page',

  /**
   * @type {string}
   */
  limitParam: 'limit',

  /**
   * @type {number}
   */
  defaultLimit: 10,

  /**
   * @type {number}
   */
  page: -1,

  /**
   * @type {number}
   */
  limit: -1
};

/**
 * @type {object}
 */
Pager.RenderOptions = {
  /**
   * @type {string}
   */
  href: '/',

  /**
   * @type {number}
   */
  pageNumbers: 3,

  /**
   * @type {boolean}
   */
  showFirstLastLinks: true,

  /**
   * @type {boolean}
   */
  showPrevNextLinks: true,

  /**
   * @type {boolean}
   */
  showDots: false,

  /**
   * @type {object}
   */
  query: {},

  /**
   * @type {boolean}
   */
  mergeQuery: true
};

/**
 * @param {number} totalCount
 */
Pager.prototype.fill = function(totalCount)
{
  this.totalCount = totalCount;
  this.pageCount = Math.ceil(totalCount / this.limit);
};

/**
 * @returns {boolean}
 */
Pager.prototype.isLinkToFirstPageAvailable = function()
{
  return this.page > 2;
};

/**
 * @returns {boolean}
 */
Pager.prototype.isLinkToPreviousPageAvailable = function()
{
  return this.page > 1;
};

/**
 * @returns {boolean}
 */
Pager.prototype.isLinkToNextPageAvailable = function()
{
  return this.page < this.pageCount;
};

/**
 * @returns {boolean}
 */
Pager.prototype.isLinkToLastPageAvailable = function()
{
  return this.page < (this.pageCount - 1);
};

/**
 * @param {Pager.RenderOptions} [options]
 */
Pager.prototype.render = function(options)
{
  /*jshint maxstatements:999*/

  if (this.pageCount < 2)
  {
    return '';
  }

  options = this.prepareRenderOptions(options);

  var href = options.href;
  var query = options.query;

  query[options.limitParam] = this.limit;
  delete query[options.pageParam];
  query[options.pageParam] = '';

  href += '?' + qs.stringify(query, '&amp;');

  var pageNrs = (options.pageNumbers - 1) / 2;
  var firstPageNr = this.page;
  var lastPageNr = firstPageNr + pageNrs;
  var cut = true;
  var showLeftDots = false;

  if ((firstPageNr - pageNrs) < 1)
  {
    firstPageNr = 1;
  }
  else
  {
    firstPageNr -= pageNrs;
    showLeftDots = firstPageNr !== 1;
  }

  if (lastPageNr > this.pageCount)
  {
    lastPageNr = this.pageCount;
    cut = false;
  }

  if (this.page < (pageNrs + 1))
  {
    lastPageNr += (pageNrs + 1) - this.page;

    if (lastPageNr > this.pageCount)
    {
      lastPageNr = this.pageCount;
    }
  }
  else if (this.page > (this.pageCount - pageNrs))
  {
    firstPageNr -= pageNrs - (this.pageCount - this.page);

    if (firstPageNr < 1)
    {
      firstPageNr = 1;
    }
  }

  var showRightDots = cut && lastPageNr !== this.pageCount;

  var result = '<div class="pagination pagination-centered"><ul>';

  if (options.showFirstLastLinks)
  {
    if (this.isLinkToFirstPageAvailable())
    {
      result += '<li><a href="' + href + '1">&laquo;</a>';
    }
    else
    {
      result += '<li class="disabled"><span>&laquo;</span>';
    }
  }

  if (options.showPrevNextLinks)
  {
    if (this.isLinkToPreviousPageAvailable())
    {
      result += '<li><a href="' + href + (this.page - 1) + '">&lsaquo;</a>';
    }
    else
    {
      result += '<li class="disabled"><span>&lsaquo;</span>';
    }
  }

  if (options.showDots && showLeftDots)
  {
    result += '<li><span>...</span>';
  }

  for (var page = firstPageNr; page <= lastPageNr; ++page)
  {
    result += '<li class="' + (page === this.page ? 'active' : '')
      + '"><a href="' + href + page + '">' + page + '</a>';
  }

  if (options.showDots && showRightDots)
  {
    result += '<li><span>...</span>';
  }

  if (options.showPrevNextLinks)
  {
    if (this.isLinkToNextPageAvailable())
    {
      result += '<li><a href="' + href + (this.page + 1) + '">&rsaquo;</a>';
    }
    else
    {
      result += '<li class="disabled"><span>&rsaquo;</span>';
    }
  }

  if (options.showFirstLastLinks)
  {
    if (this.isLinkToLastPageAvailable())
    {
      result += '<li><a href="' + href + this.pageCount + '">&raquo;</a>';
    }
    else
    {
      result += '<li class="disabled"><span>&raquo;</span>';
    }
  }

  result += '</ul></div>';

  return result;
};

/**
 * @private
 * @param {Pager.RenderOptions} options
 * @returns {Pager.Options}
 */
Pager.prototype.prepareRenderOptions = function(options)
{
  options = _.extend({}, options);

  var userQuery = options.query;

  delete options.query;

  _.defaults(options, this.options);

  if (options.mergeQuery)
  {
    options.query = _.extend(options.query, userQuery);
  }
  else
  {
    options.query = userQuery;
  }

  return options;
};
