class VideoPlugin:
  def __init__(self):
    pass

  def get_files(self, elem, get_file):
    lines = elem.text.split("\n")
    elem.text = "\n".join([get_file(lines[0])] + lines[1:])
