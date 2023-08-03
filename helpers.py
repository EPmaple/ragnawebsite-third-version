import statistics
from heapq import nlargest
import importlib
from datetime import datetime, timedelta

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

def get_slime_lists(season_number):
  module_name = f'ragna_data.s{season_number.replace(".", "_")}_data'
  try:
    module = importlib.import_module(module_name)
    season_data = module.slime_lists
    return season_data
  except ImportError:
    return None
  except AttributeError:
    return None
  
######################################################
######################################################

def get_slime_records(season_number):
  module_name = f'ragna_data.s{season_number.replace(".", "_")}_data'
  try:
    module = importlib.import_module(module_name)
    slime_records = module.slime_records
    return slime_records
  except ImportError:
    return None
  except AttributeError:
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

# when returned, return a list, then do a key:value, season_number: list
# of those that are first place of each ragna season
def ranking(season_data):
  seasonal_top = []
  seasonal_top_withSlimes = []
  for member in season_data:
    if member['ranking_slimes'] == 1:
      seasonal_top.append(member['name'])
      seasonal_top_withSlimes.append((member['name'], member['slimes']))

  return seasonal_top, seasonal_top_withSlimes

######################################################
######################################################

def most_common_name(dict):
  frequency = {}
  max_frequency = 0
  most_common_names = []

  # data.values() returns a view object representing the values of the data dictionary. The for loop iterates over the view object, and each value is printed.
  # each value is a list
  for names in dict.values(): 
    # to iterate over the name/s in the list
    for name in names:
      name = name.lower()
      # dictionary.get(key, default); name is the key to look up in the dict, and 0 is the default value to be returned if the key is not found within the dictionary
      frequency[name] = frequency.get(name, 0) + 1
      if frequency[name] > max_frequency:
        max_frequency = frequency[name]

  for name, freq in frequency.items():
    if freq == max_frequency:
      most_common_names.append(name)
  
  return most_common_names, max_frequency

######################################################
######################################################

def most_streak_names(dict):
  max_streak = 0
  current_streak = 0
  current_streak_name = None
  most_streak_names = []

  for names in dict.values():
    for name in names:
      name = name.lower()
      if name == current_streak_name:
        current_streak += 1
      else: # name != current_streak_name
        current_streak = 1
        current_streak_name = name

      if current_streak > max_streak:
        max_streak = current_streak
        most_streak_names = [current_streak_name]
      elif current_streak == max_streak:
        most_streak_names.append(current_streak_name)

  return most_streak_names, max_streak

######################################################
######################################################

# ex. input: '2023-07-20 14:29:46.408000'
def calculate_time_diff(timestamp_str1, timestamp_str2):
  # convert timestamp strings into python datetime objects by using the string_parse_time function()
  timestamp1 = datetime.strptime(timestamp_str1, '%Y-%m-%d %H:%M:%S.%f')
  timestamp2 = datetime.strptime(timestamp_str2, '%Y-%m-%d %H:%M:%S.%f')

  time_diff = timestamp2 - timestamp1

  return time_diff

# takes input of type datetime.timedelta object
# creates a new datetime.timedelta object based on the input; set the microseconds equal to 0
def remove_milliseconds(td):
  return timedelta(days=td.days, seconds=td.seconds, microseconds=0)

######################################################
######################################################

def time_between_slimes(season_data, slime_lists, slime_records):
  for item in season_data:
    member_name = item['name']
    slime_list = slime_lists[member_name]
    slime_list_len = len(slime_list)

    if slime_list_len > 1:
      current_time_diff = timedelta(days=-999999, seconds=-999999, microseconds=-999999)  # Initialize as a timedelta object
      for i in range(slime_list_len - 1):
        slime_id1 = int(slime_list[i])
        slime_id2 = int(slime_list[i + 1])

        timestamp_str1 = slime_records[slime_id1]['time']
        timestamp_str2 = slime_records[slime_id2]['time']

        time_diff = calculate_time_diff(timestamp_str1, timestamp_str2)
        if time_diff > current_time_diff:
          current_time_diff = time_diff

      current_time_diff = remove_milliseconds(current_time_diff)
      item['time_between_slimes'] = str(current_time_diff)

    else:
      item['time_between_slimes'] = None

  #print(season_data)

######################################################
######################################################

def find_name_with_most_slimes(dict):
  current_max_slimes = 0
  name_with_most_slimes = ''
  current_greatest_season = ''

  for name, slimes_dict in dict.items():
    greatest_season = max(slimes_dict, key=slimes_dict.get)
    local_max_slimes = slimes_dict[greatest_season]

    if local_max_slimes > current_max_slimes:
      current_max_slimes = local_max_slimes
      name_with_most_slimes = name
      current_greatest_season = greatest_season
  
  return name_with_most_slimes, current_max_slimes, current_greatest_season