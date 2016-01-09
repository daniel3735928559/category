<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="xml" indent="no" omit-xml-declaration="yes" />
  
  <xsl:template match="video">
    <xsl:variable name="id" select="@id" />
    <video id="{@id}">
      <xsl:copy-of select="source" />
      Please use an HTML5-compliant browser to view video
    </video>
    <xsl:for-each select="index/section">
      <a onclick="skip({$id}, {@timestamp})">{@name}</a>
      <xsl:for-each select="point">
	<a onclick="skip({$id}, {@timestamp})">{position()}</a>
      </xsl:for-each>
    </xsl:for-each>
  </xsl:template>

  <xsl:template match="image">
    <xsl:variable name="id" select="@id" />
    <video id="{@id}">
      <xsl:copy-of select="source" />
      Please use an HTML5-compliant browser to view video
    </video>
    <xsl:for-each select="index/section">
      <a onclick="iamge_skip({$id}, {@timestamp})">{@name}</a>
      <xsl:for-each select="point">
	<a onclick="image_skip({$id}, {@timestamp})">{position()}</a>
      </xsl:for-each>
    </xsl:for-each>
  </xsl:template>
  
  <xsl:template match="audio">
    <audio id="{@id}">
      <xsl:copy-of select="source" />
      Please use an HTML5-compliant browser to hear audio
    </audio>
  </xsl:template>

  <xsl:template match="@*|node()">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
    </xsl:copy>
  </xsl:template>
  
</xsl:stylesheet>
