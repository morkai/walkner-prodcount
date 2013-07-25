define([
  'Underscore',
  'app/views/View',
  'app/views/PaginationView',
  'app/templates/list',
  'app/i18n',
  'i18n!app/nls/counters'
], function(
  _,
  View,
  PaginationView,
  listTemplate,
  t
) {
  'use strict';

  /**
   * @name app.views.CountersListView
   * @constructor
   * @extends {app.views.View}
   * @param {object} [options]
   */
  var CountersListView = View.extend({

    template: listTemplate

  });

  CountersListView.prototype.initialize = function()
  {
    this.listenTo(this.model, 'reset', this.render);

    this.setView('.pagination', new PaginationView({
      model: this.model.paginationData
    }));
  };

  CountersListView.prototype.serialize = function()
  {
    var collection = this.model;

    return {
      columns: [
        {id: 'name', label: t('counters', 'PROPERTY_NAME')}
      ],
      rows: collection.toJSON(),
      actions: function(row)
      {
        var model = collection.get(row._id);

        return [
          {
            id: 'read',
            icon: 'file-alt',
            label: t('counters', 'TABLE_ACTION_VIEW'),
            href: model.genUrl()
          },
          {
            id: 'edit',
            icon: 'edit',
            label: t('counters', 'TABLE_ACTION_EDIT'),
            href: model.genUrl('edit')
          },
          {
            id: 'delete',
            icon: 'trash',
            label: t('counters', 'TABLE_ACTION_DELETE'),
            href: model.genUrl('delete')
          }
        ];
      }
    };
  };

  return CountersListView;
});
