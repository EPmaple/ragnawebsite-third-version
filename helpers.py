import statistics
from heapq import nlargest
import importlib

######################################################
######################################################

#season_data is passed in as a list containing items with respective elements
#output: sum and average of values of the element
def listize(season_data, element):
    slime_values = [item[element] for item in season_data]
    sum_of_elements = sum(slime_values)
    average_of_elements = round(statistics.mean(slime_values), 2)
    return sum_of_elements, average_of_elements

"""
slime_values = [item['slimes'] for item in season_data]
sum_of_slimes = sum(slime_values)
average_of_slimes = round(statistics.mean(slime_values), 2)

zoom_values = [item['zooms'] for item in season_data]
sum_of_zooms = sum(zoom_values)
average_of_zooms = round(statistics.mean(zoom_values), 2)
"""

######################################################
######################################################

def top_members(season_data):
  return nlargest(3, season_data, key=lambda item: item['slimes'])

######################################################
######################################################

#add a ranking to each item in season_data
#change made in the function will persist outside the function scope
def ranking_slimes(season_data):
  sorted_season_data_slimes = sorted(season_data, key=lambda item: item['slimes'], reverse=True)

  ranking = 0
  prev_slimes = None
  for item in sorted_season_data_slimes:
    if item['slimes'] != prev_slimes:
      ranking += 1
    item['ranking_slimes'] = ranking
    prev_slimes = item['slimes']

######################################################
######################################################
"""
def get_season_data(season_number):
    return data.season_data.get(season_number, [])
"""

def get_season_data(season_number):
  module_name = f'ragna_data.s{season_number.replace(".", "_")}_data'
  try:
    module = importlib.import_module(module_name)
    season_data = module.season_data
    return season_data
  except ImportError:
    return None
  
######################################################
######################################################

def to_sort_data(season_data, sort_order):
  if sort_order.startswith('sort_name'):
    if sort_order.endswith('asc'):
      sorted_season_data = sorted(season_data, key=lambda item: item['name'], reverse=True)
    else:
      sorted_season_data = sorted(season_data, key=lambda item: item['name'])

  elif sort_order.startswith('sort_slimes'):
    if sort_order.endswith('asc'):
      sorted_season_data = sorted(season_data, key=lambda item: item['slimes'])
    else:
      sorted_season_data = sorted(season_data, key=lambda item: item['slimes'], reverse=True)
  
  elif sort_order.startswith('sort_zooms'):
    if sort_order.endswith('asc'):
      sorted_season_data = sorted(season_data, key=lambda item: item['zooms'])
    else:
      sorted_season_data = sorted(season_data, key=lambda item: item['zooms'], reverse=True)
  
  return sorted_season_data
  
#i will want to return sorted_season_data for correct ranking,
#the name of the website, example, "s18-sort_name=asc.html"
#

######################################################
######################################################

sort_orders = [
    'sort_name=asc',
    'sort_name=desc',
    'sort_slimes=asc',
    'sort_slimes=desc',
    'sort_zooms=asc',
    'sort_zooms=desc'
]