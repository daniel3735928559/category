class VideoPlugin:
  def __init__(self):
    pass

  def get_files(self, elem, get_file):
    elem.text = get_file(elem.text)
